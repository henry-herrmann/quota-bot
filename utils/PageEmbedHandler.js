
let pageEmbeds = [];

function getPageEmbeds(){
    return pageEmbeds;
}

function getPageEmbed(messageId){
    return pageEmbeds.find(embed => embed.messageId == messageId);
}

function removePageEmbed(messageId){
    const index = pageEmbeds.findIndex(embed => embed.messageId == messageId);

    pageEmbeds.splice(index, 1);
}

function addEmbed(embed, messageId){
    pageEmbeds.push({
        messageId: messageId,
        embed: embed
    });
}

module.exports = {
    getPageEmbeds: getPageEmbeds,
    getPageEmbed: getPageEmbed,
    removePageEmbed: removePageEmbed,
    addEmbed: addEmbed
}