import math
import heapq
import bisect
from collections import deque, defaultdict, Counter
from typing import List, Optional, Tuple, Dict, Set

"""
Pool 1, "Wrapped Bitcoin and Circle USD" contains 175 WBTC and 15870000 USDC
Pool 2, "Wrapped Bitcoin and Ethereum" contains 1340 WBTC and 70730 ETH
Pool 3, "Circle USD and Ethereum" contains 42330000 USDC and 14550 ETH
Pool 4, "Frax Finance and Circle USD" contains 47240000 FRAX and 42090000 USDC
Pool 5, "DAI and Circle USD" contains 28560000 DAI and 30300000 USDC
Pool 6, "Ethereum and Tether" contains 10890 ETH and 28390000 USDT
Pool 7, "Circle USD and Tether" contains 21740000 USDC and 24350000 USDT
Pool 8, "Chainlink and Ethereum" contains 810000 LINK and 6870 ETH
Pool 9, "CryptoGPT and Circle USD" contains 317090 GPT and 437240 USDC
Pool 10, "MakerDAO and Ethereum" contains 14090 MKR and 1260 ETH
Pool 11, "Ethereum and Ethereum Meta" contains 5000 ETH and 5000 ETHM
Pool 12, "Uniswap and Ethereum" contains 3500000 UNI and 870 ETH
Pool 13, "DAI and Frax Finance" contains 8390000 DAI and 9870000 FRAX
Pool 14, "Mantle and Ethereum" contains 16170000 MNT and 3720 ETH
Pool 15, "Mantle and HeckaSwap" contains 10000 MNT and 10000 HKS
Pool 16, "HeckaSwap and Frax Finance" contains 10000 HKS and 10000 FRAX
"""
def getAmountOut(amountIn, reserveIn, reserveOut):
    amountInWithFee = amountIn * 997
    numerator = amountInWithFee * reserveOut
    denominator = reserveIn * 1000 + amountInWithFee
    return numerator / denominator


def helper(input):
    # Build the graph
    graph = defaultdict(list)
    exchange_rate = defaultdict(float)
    for line in input:
        words = line.split(" ")
        n = len(words)
        if n == 1:
            continue
        curr1, curr2 = words[n-4], words[-1][:-1]
        print(words[n-5], words[n-2])
        
        curr1_to_curr2 = int(words[n-2]) / int(words[n-5])
        curr2_to_curr1 = int(words[n-5]) / int(words[n-2])
        
        graph[curr1].append(curr2)
        graph[curr2].append(curr1)

        exchange_rate[(curr1, curr2)] = curr1_to_curr2
        exchange_rate[(curr2, curr1)] = curr2_to_curr1

    unqiue_cycles = set()

    # Run DFS to find all cycles
    def dfs(node, path: list, seen: set):
        # base case: cycle close
        if path and node == path[0] and len(path) >= 3:
            unqiue_cycles.add(tuple(path))
            return True
        
        # base case: run into a seen node
        if node in seen:
            return True
        
        # add the current node to path and seen
        path.append(node)
        seen.add(node)
        
        # recursion
        for next_node in graph[node]:
            if not dfs(next_node, path, seen):
                path.pop()
                seen.remove(next_node)  
        
        return False
    
    seen = set()
    dfs('USDC', [], seen)

    profit_ratios = []
    for cycles in unqiue_cycles:
        cycles_list = list(cycles)
        cycles_list.append(cycles_list[0])
        print(cycles_list)

        profit_ratio = 1
        for i in range(len(cycles_list)-1):
            profit_ratio *= exchange_rate[(cycles_list[i], cycles_list[i+1])]
        profit_ratios.append(profit_ratio)
        print(cycles_list, "with profit ratio: ", profit_ratio)

    return profit_ratios


if __name__ == "__main__":
    input = []
    with open("input.txt") as f:
        for line in f:
            input.append(line)
    
    print(helper(input))
