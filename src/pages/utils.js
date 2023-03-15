import { ethers } from "ethers";

export const MINIMUM = {
    1: {
        "ETH": ethers.utils.parseEther("0.001"),
        "USDC": ethers.utils.parseUnits("2", 6),
        "FREN": ethers.utils.parseEther("10000"),
    },
    44444: {
        "ETH": ethers.utils.parseEther("0.003"),
        "USDC": ethers.utils.parseUnits("10", 6),
        "FREN": ethers.utils.parseEther("33000"),
    }
}

export function formatTokenAmount(token, amount) {
    if (amount === undefined) {
        return "0";
    }
    if (token === 'ETH' || token === 'FREN') {
        return ethers.utils.formatEther(amount.toString());
    } else {
        return amount.div("1000000").toString()
    }
}

export function isAboveMinimum(token, chain, amount) {
    if (!token || !chain || !amount) {
        return false;
    }
    if (token === "USDC") {
        return MINIMUM[chain]?.[token].lte(Math.floor(amount * 1000000));
    } else {
        return MINIMUM[chain]?.[token].lte(ethers.utils.parseEther(amount));
    }
}
