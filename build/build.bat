REM build.bat

REM compile
javac -cp rabbitmq-client.jar AMQP.java

REM load
call loadjava -f -verbose -oracleresolver -resolve -oci8 -u <username>/<password>@<sid> commons-cli-1.1.jar
call loadjava -f -verbose -oracleresolver -resolve -oci8 -u <username>/<password>@<sid> commons-io-1.2.jar
call loadjava -f -verbose -oracleresolver -resolve -oci8 -u <username>/<password>@<sid> rabbitmq-client.jar
call loadjava -f -verbose -oracleresolver -resolve -oci8 -u <username>/<password>@<sid> AMQP.class

REM sql
sqlplus <username>/<password>@<sid> @create.sql 