-- PostgreSQL Database Schema for PGEase (PG Management SaaS)
-- Designed for production PostgreSQL with proper relations, foreign keys, and indexes.

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Authentication & Roles)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'owner', 'staff', 'tenant')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PG Properties Table
CREATE TABLE pg_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255),
    address TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    upi_id VARCHAR(100) NOT NULL,
    starting_rent NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
    standard_deposit NUMERIC(10, 2) NOT NULL DEFAULT 15000.00,
    check_in_time VARCHAR(20) DEFAULT '09:00 AM',
    check_out_time VARCHAR(20) DEFAULT '12:00 PM',
    gate_closing_time VARCHAR(20) DEFAULT '10:30 PM',
    visiting_hours VARCHAR(100) DEFAULT '10:00 AM to 08:00 PM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role_title VARCHAR(100) NOT NULL, -- e.g., Electrician, Plumber, Housekeeping
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rooms Table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    sharing_type VARCHAR(50) NOT NULL CHECK (sharing_type IN ('single', 'double', 'triple', 'four_sharing')),
    total_beds INT NOT NULL DEFAULT 2,
    occupied_beds INT NOT NULL DEFAULT 0,
    rent_per_bed NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    is_ac BOOLEAN NOT NULL DEFAULT false,
    has_attached_bathroom BOOLEAN NOT NULL DEFAULT true,
    has_balcony BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'few_beds_left', 'occupied', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Beds Table
CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    bed_number INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tenants Table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    bed_id UUID NOT NULL REFERENCES beds(id) ON DELETE RESTRICT,
    emergency_contact VARCHAR(20) NOT NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_rent NUMERIC(10, 2) NOT NULL,
    deposit_paid NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue', 'partially_paid')),
    food_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (food_status IN ('confirmed', 'not_available', 'pending')),
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'notice_period', 'inactive')),
    id_proof_type VARCHAR(50) NOT NULL DEFAULT 'Aadhaar',
    id_proof_number VARCHAR(100) NOT NULL,
    workplace_or_college VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Late Payment Penalty Configuration Table
CREATE TABLE penalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    grace_period_days INT NOT NULL DEFAULT 0,
    daily_penalty_amount NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    max_penalty_amount NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Rent Invoices and Payments Table
CREATE TABLE rent_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_month VARCHAR(50) NOT NULL, -- e.g. "September 2026"
    base_rent NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    late_days INT NOT NULL DEFAULT 0,
    penalty_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'partially_paid')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('UPI', 'Card', 'Net Banking', 'Cash')),
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Food Preferences & Reminder Configuration
CREATE TABLE food_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    breakfast_cutoff VARCHAR(20) DEFAULT '08:00 AM',
    lunch_cutoff VARCHAR(20) DEFAULT '11:00 AM',
    dinner_cutoff VARCHAR(20) DEFAULT '05:00 PM',
    enable_in_app BOOLEAN DEFAULT true,
    enable_whatsapp BOOLEAN DEFAULT false,
    enable_sms BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Daily Food Records & Confirmations
CREATE TABLE food_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'not_available')),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_meal_per_day UNIQUE (tenant_id, record_date, meal_type)
);

-- 11. Complaints Table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    ticket_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "CMP1024"
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Electricity', 'Plumbing', 'Wi-Fi', 'Cleaning', 'Food', 'Room', 'Maintenance', 'Other')),
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Emergency')),
    description TEXT NOT NULL,
    photo_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed')),
    assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Complaint Updates & Logs
CREATE TABLE complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by_user_id UUID NOT NULL REFERENCES users(id),
    updater_role VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status_change VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES pg_properties(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all', 'floor_1', 'floor_2', etc.
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES pg_properties(id) ON DELETE CASCADE,
    target_role VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'rent', 'food', 'complaint', 'announcement', 'system'
    link_tab VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Tenant Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    doc_type VARCHAR(100) NOT NULL, -- 'Aadhaar Card', 'Rental Agreement', 'Employment Letter'
    doc_name VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_tenants_room ON tenants(room_id);
CREATE INDEX idx_rent_payments_tenant ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_food_records_date_meal ON food_records(record_date, meal_type);
CREATE INDEX idx_complaints_property ON complaints(property_id);
CREATE INDEX idx_complaints_tenant ON complaints(tenant_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
