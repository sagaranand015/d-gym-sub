// We'll use ethers to interact with the Ethereum network and our contract
import { NFTStorage, File } from 'nft.storage'
const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM4ZUUwMTVjMkFERDMwQjJBNTFlQTIxMEVkNWZhN2ZGYzM5OEE5MjEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzMwODgyNjI3MiwibmFtZSI6ImRlY28tZGVtbzAxIn0.3f40mV9skKhlSib5XfK3nOZKuHwTDJSwYknV2ndpIAo' })

export async function SaveToIpfsStorage(name, description, imgFile) {
    const metadata = await client.store({
    name: name,
    description: description,
    image: imgFile,
    });
    console.log("Ipfs URL is: ", metadata.url)
    return metadata;
}