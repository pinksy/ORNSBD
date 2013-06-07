import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.MessageProperties;

public class AMQP {

  public static void amqp_publish(String host, String exchange, String routingKey, String message) throws java.io.IOException {

    Connection connection = null;
    Channel channel = null;

    try {
      ConnectionFactory factory = new ConnectionFactory();
      factory.setHost(host);
      connection = factory.newConnection();
      channel = connection.createChannel();

      channel.exchangeDeclare(exchange, "direct");
      channel.basicPublish(exchange, routingKey, null, message.getBytes());
      channel.close();
      connection.close();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    finally {
      if (connection != null) {
        try {
        connection.close();
        }
        catch (Exception ignore) {}
      }
    }
  }
}