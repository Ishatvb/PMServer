CREATE TABLE user_auth (
    user_id VARCHAR(20) NOT NULL PRIMARY KEY,
    user_type CHAR(1) NOT NULL,
    phone_no VARCHAR(10) NOT NULL,
    email VARCHAR(50),
    pwd_hash VARCHAR(100) NOT NULL
);

CREATE TABLE doctor (
    user_id VARCHAR(20) NOT NULL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    specialist VARCHAR(30),
    other_details JSONB NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_auth(user_id)
);

CREATE TABLE patient (
    user_id VARCHAR(20) NOT NULL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    other_details JSONB NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_auth(user_id)
);

CREATE TABLE ongoing_treatment (
    pris_id VARCHAR(30) NOT NULL,
    pat_id VARCHAR(20) NOT NULL,
    doc_id VARCHAR(20),
    pris_content JSONB NOT NULL,
    doc_details JSONB,
    PRIMARY KEY (pris_id, pat_id),
    FOREIGN KEY (pat_id) REFERENCES patient(user_id),
    FOREIGN KEY (doc_id) REFERENCES doctor(user_id),
    CHECK (doc_id IS NOT NULL OR doc_details IS NOT NULL)
);

CREATE TABLE med_history (
    pris_id VARCHAR(30) NOT NULL,
    pat_id VARCHAR(20) NOT NULL,
    doc_id VARCHAR(20),
    pris_content JSONB NOT NULL,
    doc_details JSONB,
    PRIMARY KEY (pris_id, pat_id),
    FOREIGN KEY (pat_id) REFERENCES patient(user_id),
    FOREIGN KEY (doc_id) REFERENCES doctor(user_id),
    CHECK (doc_id IS NOT NULL OR doc_details IS NOT NULL)
);

-- Log table
CREATE TABLE change_log (
    log_id SERIAL PRIMARY KEY,
    relation_name VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    changed_data JSONB NOT NULL,
    change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger Function
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO change_log (relation_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO change_log (relation_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO change_log (relation_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_auth
CREATE TRIGGER user_auth_changes
AFTER INSERT OR UPDATE OR DELETE ON user_auth
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Trigger for doctor
CREATE TRIGGER doctor_changes
AFTER INSERT OR UPDATE OR DELETE ON doctor
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Trigger for patient
CREATE TRIGGER patient_changes
AFTER INSERT OR UPDATE OR DELETE ON patient
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Trigger for ongoing_treatment
CREATE TRIGGER ongoing_treatment_changes
AFTER INSERT OR UPDATE OR DELETE ON ongoing_treatment
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Trigger for med_history
CREATE TRIGGER med_history_changes
AFTER INSERT OR UPDATE OR DELETE ON med_history
FOR EACH ROW EXECUTE FUNCTION log_changes();