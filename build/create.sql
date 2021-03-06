ALTER JAVA CLASS "AMQP" COMPILE;

CREATE OR REPLACE PROCEDURE amqp_publish(host IN VARCHAR2, exchange IN VARCHAR2, routingKey IN VARCHAR2, message IN VARCHAR2)
AS LANGUAGE JAVA NAME 'AMQP.amqp_publish(java.lang.String, java.lang.String, java.lang.String, java.lang.String)';
/

DROP TABLE FRUITS;
CREATE TABLE FRUITS
(
  FRUIT   VARCHAR2(10) NOT NULL,
  GENUS   VARCHAR2(10),
  SALES   NUMBER(4),
  RETURNS NUMBER(4)
)
TABLESPACE EXAMPLE
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    NEXT 1M
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('STRAWBERRY', 'FRAGARIA', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('BANANA', 'MUSA', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('MANGO', 'MANGIFERA', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('WATERMELON', 'CUCUMIS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('APPLE', 'MALUS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('ORANGE', 'CITRUS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('PINEAPPLE', 'ANANAS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('GRAPE', 'VITIS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('CHERRY', 'PRUNUS', 0, 0);
INSERT INTO FRUITS (FRUIT, GENUS, SALES, RETURNS) VALUES ('KIWI', 'ACTINIDIA', 0, 0);
COMMIT;
CREATE OR REPLACE TRIGGER fruits_trg
AFTER INSERT OR DELETE OR UPDATE ON FRUITS
FOR EACH ROW
DECLARE
  vv_host VARCHAR2(9) := 'localhost';
  vv_exchange VARCHAR2(8) := 'oraclemq';
  vv_message VARCHAR2(100);
BEGIN
  vv_message := '{"type": "fruit", "name": "' || :NEW.FRUIT || '", "sales": ' || :NEW.SALES || '}';
  amqp_publish(vv_host, vv_exchange, :NEW.FRUIT, vv_message);
END;
/

DROP TABLE VEGETABLES;
CREATE TABLE VEGETABLES
(
  VEGETABLE VARCHAR2(10) NOT NULL,
  GENUS     VARCHAR2(10),
  SALES     NUMBER(4),
  RETURNS   NUMBER(4)
)
TABLESPACE EXAMPLE
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    NEXT 1M
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('CARROT', 'DAUCUS', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('POTATO', 'SOLANUM', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('TOMOATO', 'SOLANUM', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('ONION', 'ALLIUM', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('BROCCOLI', 'BRASSICA', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('MUSHROOM', 'AGARICUS', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('LETTUCE', 'LACTUCA', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('PEPPER', 'CAPSICUM', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('PUMPKIN', 'CUCURBITA', 0, 0);
INSERT INTO VEGETABLES (VEGETABLE, GENUS, SALES, RETURNS) VALUES ('COURGETTE', 'CUCURBITA', 0, 0);
COMMIT;
CREATE OR REPLACE TRIGGER vegetables_trg
AFTER INSERT OR DELETE OR UPDATE ON VEGETABLES
FOR EACH ROW
DECLARE
  vv_host VARCHAR2(9) := 'localhost';
  vv_exchange VARCHAR2(8) := 'oraclemq';
  vv_message VARCHAR2(100);
BEGIN
  vv_message := '{"type": "vegetable", "name": "' || :NEW.VEGETABLE || '", "sales": ' || :NEW.SALES || '}';
  amqp_publish(vv_host, vv_exchange, :NEW.VEGETABLE, vv_message);
END;
/

SHOW ERRORS
EXIT