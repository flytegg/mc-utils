const webhookURL = process.env.DISCORD_WEBHOOK

// @ts-ignore
export async function sendToDiscordWebhook(messageContent) {
    alert("test1")
    if (!webhookURL) { return }
alert(webhookURL)
    await fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messageContent }),
    });
}
