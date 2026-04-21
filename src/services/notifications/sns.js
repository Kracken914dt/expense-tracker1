import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
});

export async function publishRegistrationNotification(user) {
  const topicArn = process.env.SNS_TOPIC_ARN;

  if (!topicArn) {
    console.warn("SNS_TOPIC_ARN not configured, skipping registration notification");
    return;
  }

  const message = {
    eventType: "USER_REGISTERED",
    userId: String(user.id),
    name: user.name,
    email: user.email,
    registeredAt: new Date().toISOString(),
  };

  const command = new PublishCommand({
    TopicArn: topicArn,
    Subject: "Nuevo usuario registrado",
    Message: JSON.stringify(message, null, 2),
    MessageAttributes: {
      eventType: {
        DataType: "String",
        StringValue: "USER_REGISTERED",
      },
      userEmail: {
        DataType: "String",
        StringValue: user.email,
      },
    },
  });

  await snsClient.send(command);
}
