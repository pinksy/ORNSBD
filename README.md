ORNSBD
======

*Oracle > RabbitMQ > Node.js > Socket.io > Backbone.js > D3.js*

ORNSBD is an example application, showing how you might push data changes from an Oracle database onto a RabbitMQ queue, consume the messages with Node.js and Express.js, stream them to the browser with Socket.io, and render them with Backbone.js and D3.js

The demo relies on RabbitMQ's Java client, which can be loaded into the Oracle database using the loadjava utility. Note that Oracle XE is not suitable, as it doesn't include Java

Setup
-----

I ran my demo on Windows 7, with Oracle 11g Personal Edition. I will assume you have the same. YMMV

You'll need to have a JDK installed. It's probably best to have the JDK that corresponds to the JRE in your Oracle database. I determined this by following MetaLink ID 331673.1

1. As SYSDBA:

        call dbms_java.grant_permission( 'HR', 'SYS:java.net.SocketPermission', '127.0.0.1:5672', 'connect,resolve' );  
        call dbms_java.grant_permission( 'HR', 'SYS:java.util.PropertyPermission', 'java.net.preferIPv4Stack', 'write' );  

2. Add your own database credentials to build/build.bat, and run  

3. Open a command prompt in the node folder:

        npm install amqp  
        npm install ejs  
        npm install express    
        npm install socket.io  
        node app  

4. Insert some data:

        UPDATE FRUITS SET SALES = 100 WHERE FRUIT = 'MANGO';  
        UPDATE VEGETABLES SET SALES = 200 WHERE VEGETABLE = 'POTATO';  

5.  See it in your browser at [http://localhost:3000/basic] [1] or [http://localhost:3000/pretty] [2]  
  [1]: http://localhost:3000/basic    "http://localhost:3000/basic"  
  [2]: http://localhost:3000/pretty   "http://localhost:3000/pretty"  
6.  Add your own database credentials to demo.vbs, run, and watch it go  

*You may need to commit your SQL before running demo.vbs*