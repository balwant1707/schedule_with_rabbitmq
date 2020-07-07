const amqp = require('amqplib/callback_api');

function receiveMessage() {
    try {

        amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`, (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                const queue = 'delay_notification';

                //When RabbitMQ quits or crashes it will forget the queues and messages, to make sure aren't lost: we need to mark both the queue and messages as durable
                channel.assertQueue(queue, {
                    durable: true
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, function (msg) {
                    console.log(" [x] messages Received %s", queue, msg.content.toString());

                    const payload = JSON.parse(msg.content.toString());


                    const message = payload.msg;
                    console.log("Message Received with delay", message);

                }, {
                    noAck: true
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

receiveMessage()