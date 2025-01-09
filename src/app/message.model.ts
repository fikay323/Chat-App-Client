export class Message {
    constructor(
        public content: string, 
        public to: string, 
        public sentBy: string, 
        public messageID?: string, 
        public senderName?: string, 
        public dateTime?: Date
    ) {}
}