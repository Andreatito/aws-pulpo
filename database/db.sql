CREATE DATABASE pulpo_backoffice;

USE pulpo_backoffice;

CREATE TABLE users (

id  INT  NOT NULL PRIMARY KEY,
username VARCHAR(20) NOT NULL,
password VARCHAR(50) NOT NULL,
fullname VARCHAR(100) NOT NULL

);

ALTER TABLE users
MODIFY id INT NOT NULL AUTO_INCREMENT;


RENAME TABLE users TO cuentas ;

ALTER TABLE cuentas 
ADD created_at timestamp NOT NULL DEFAULT current_timestamp;

ALTER TABLE cuentas 
ADD user_id INT(11) ;

alter table cuentas
  CHANGE username nombre VARCHAR(20) ;

  alter table cuentas
  CHANGE password plan VARCHAR(50) ;

  ALTER TABLE users
MODIFY password
varchar(60);


DESCRIBE cuentas;
DESCRIBE users;

DELETE FROM users WHERE username ='Pablo';

ALTER TABLE cuentas 
ADD status_c VARCHAR(15) ;

ALTER TABLE cuentas 
ADD timezone VARCHAR(30) ;