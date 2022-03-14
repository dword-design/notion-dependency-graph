import { Client, LogLevel } from '@notionhq/client'

export default new Client({
  auth: process.env.NOTION_API_TOKEN,
  logLevel: LogLevel.ERROR,
})
