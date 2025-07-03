DELIMITER $$

CREATE PROCEDURE insert_100_employees()
BEGIN
  DECLARE i INT DEFAULT 1;

  WHILE i <= 100 DO
    INSERT INTO employees (
      first_name, last_name, email, hire_date
    ) VALUES (
      CONCAT('FirstName', i),
      CASE 
        WHEN i % 3 = 0 THEN CONCAT('LastName', i)
        ELSE NULL
      END,
      CONCAT('user', i, '@example.com'),
      CURDATE() - INTERVAL FLOOR(RAND() * 3650) DAY -- случайная дата за последние ~10 лет
    );

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

-- Запуск процедуры
CALL insert_100_employees();
