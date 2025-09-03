CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from admin where email = "admin1@gmail.com";

INSERT INTO `feedbackapp`.`admin` (`name`, `email`, `password_hash`) VALUES ('Admin1', 'admin1@gmail.com', '$2b$12$5YP7lWhXxmoR0P6CBb8XaOMZ3rmHNEtYBzkIxT.oHLDo/ohzzg6FC');

CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    feedback TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customer(id) ON DELETE CASCADE
);

select * from feedback;
SELECT f.feedback, f.created_at, CASE WHEN f.is_anonymous = 1 THEN 'Anonymous' ELSE c.name END as customer_name FROM feedback f JOIN customer c ON f.user_id = c.id ORDER BY f.created_at DESC;
truncate table feedback;