
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    admin_key INTEGER NOT NULL DEFAULT 1 CHECK (admin_key = 1),
    telephone VARCHAR(9) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_admin_only UNIQUE (admin_key)

        );   

CREATE TABLE deliveries(
    id_delivery SERIAL PRIMARY KEY ,
    sender_name VARCHAR(50) NOT NULL  ,
    sender_phone VARCHAR(9) NOT NULL,
    recovery_zone  VARCHAR(50) NOT NULL ,
    recipient_name  VARCHAR(50) NOT NULL,
    recipient_phone VARCHAR(9) NOT NULL, 
    zone   VARCHAR(50) NOT NULL,
    package_type   VARCHAR(50) NOT NULL ,
    hour  TIME NOT NULL,
    payment_method VARCHAR(15) NOT NULL CHECK (payment_method IN ('cash', 'wave', 'orange_money')),    instruction  TEXT NOT NULL,
    statut VARCHAR(20)  NOT NULL DEFAULT 'pending' 
        CHECK (statut IN ('pending','in_delivery','delivered')),
    date_creation TIMESTAMP DEFAULT NOW()
        
);
CREATE TABLE services(
    id_service SERIAL PRIMARY KEY ,
    requester_name  VARCHAR(50) NOT NULL  ,
    requester_phone  VARCHAR(9) NOT NULL ,
    service   VARCHAR(50) NOT NULL  ,
    proposed_price   INTEGER NOT NULL,  
    service_details  TEXT NOT NULL  ,
    statut VARCHAR(20)  NOT NULL DEFAULT 'pending' 
        CHECK (statut IN ('pending','in_progress','resolved')),
    created_at TIMESTAMP DEFAULT NOW()

);
CREATE TABLE feedbacks (
    id_feedback  SERIAL PRIMARY KEY ,
    feedback_sender   VARCHAR(50) NOT NULL,
    comments   TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_featured  BOOLEAN DEFAULT FALSE
)
CREATE TABLE login_rate_limits (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    blocked_until TIMESTAMP,
    last_attempt_at TIMESTAMP DEFAULT NOW()
);
