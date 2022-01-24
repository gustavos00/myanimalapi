import { Expo } from 'expo-server-sdk';
const expo = new Expo()

interface sendNotificationsParams {
  expoToken: string;
  title: string
  message: string;
}

export const sendNotifications = async({
  expoToken,
  title,
  message,
}: sendNotificationsParams) => {
    if(!Expo.isExpoPushToken(expoToken)) {
        return console.log('Error sending expo token')
    }

    const notificationMessage = [{
        to: expoToken,
        title,
        body: message,
        data: { doWhat: 'test' }
    }]

    const receipt = await expo.sendPushNotificationsAsync(notificationMessage)
    return receipt
};
