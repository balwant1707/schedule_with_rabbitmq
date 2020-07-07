const amqp = require('amqplib/callback_api');

function scheduleMessage(exchange, queue, params, delayInMilliSeconds) {
    try {

        amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                channel.assertExchange(exchange, "x-delayed-message", {
                    durable: true,
                    arguments: {
                        'x-delayed-type': "direct"
                    }
                })


                channel.bindQueue(queue, exchange, queue)

                channel.publish(exchange, queue, new Buffer.from(params), {
                    headers: {
                        "x-delay": delayInMilliSeconds
                    }
                })


                console.log(" [x] Sent %s", params);
            });
            setTimeout(function () {
                connection.close();
            }, 500);

        });
    } catch (error) {
        console.log(error);
    }

}

scheduleMessage("send_with_delay_new", "delay_notification", JSON.stringify({
    msg: "Test"
}), 10000)