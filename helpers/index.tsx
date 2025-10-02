export const secondsToDDHHMMSS = (totalSeconds: number) => {

    const days = Math.floor(totalSeconds / 24 / 60 / 60);
    const hoursLeft = Math.floor((totalSeconds) - (days * 86400));
    const hours = Math.floor(hoursLeft / 3600);
    const minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    const minutes = Math.floor(minutesLeft / 60);
    const seconds = totalSeconds % 60;

    const strDays: string = `${days}`
    let strHours: string = `${hours}`
    let strMinutes: string = `${minutes}`
    let strSeconds: string = `${seconds}`

    // Padding the values to ensure they are two digits
    if (hours < 10) { strHours = "0" + hours; }
    if (minutes < 10) { strMinutes = "0" + minutes; }
    if (seconds < 10) { strSeconds = "0" + seconds; }

    return {
        days: strDays,
        hours: strHours,
        minutes: strMinutes,
        seconds: strSeconds
    }
}

export const titleToIcon = (title: string) => {

    let icon = "/assets/images/aptos-logo.png"

    if (title.includes("BTC") || title.includes("Bitcoin")) {
        icon = "/assets/images/btc-icon.png"
    } else if (title.includes("Tether") || title.includes("USDT")) {
        icon = "/assets/images/usdt-logo.png"
    } else if (title.includes("Cardano")) {
        icon = "/assets/images/cardano-icon.webp"
    } else if (title.includes("XRP")) {
        icon = "/assets/images/xrp-icon.png"
    } else if (title.includes("Ethereum") || title.includes("ETH")) {
        icon = "/assets/images/eth-icon.png"
    } else if (title.includes("Solana") || title.includes("SOL")) {
        icon = "/assets/images/solana-icon.png"
    } else if (title.includes("SUI") || title.includes("Sui")) {
        icon = "/assets/images/sui-sui-logo.svg"
    } else if (title.includes("Celeatia") || title.includes("TIA")) {
        icon = "/assets/images/icons/celestia-logo.png"
    } else if (title.includes("Chainlink") || title.includes("LINK")) {
        icon = "/assets/images/icons/chainlink-logo.png"
    } else if (title.includes("Uniswap") || title.includes("UNI")) {
        icon = "/assets/images/icons/uniswap-logo.png"
    }

    return icon

}

export const parseTables = (input: string) => {
    const tableRegex = /\|.*\|\n(\|[-| ]+\|\n)?([\s\S]*?)\|.*\|/g;
    const tables = input.match(tableRegex);
    return tables ? cleanUrls(tables.join("\n")) : undefined
}


export const cleanUrls = (input: string) => {
    const cleanTable = (input.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')).replace(/!\[.*?<br><br>(.*?)<br><br>.*?\]\(.*?\)/g, '$1');
    return cleanTable
}

export const shortAddress = (address: string, first = 6, last = -4) => {
    if (!address) return ''
    return `${address.slice(0, first)}...${address.slice(last)}`
}