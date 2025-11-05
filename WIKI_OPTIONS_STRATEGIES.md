# Options Trading Strategies Guide

This guide covers the most common and effective options trading strategies used by traders. Each strategy has different risk profiles, profit potential, and use cases.

## Table of Contents
1. [Basic Strategies](#basic-strategies)
2. [Bullish Strategies](#bullish-strategies)
3. [Bearish Strategies](#bearish-strategies)
4. [Neutral Strategies](#neutral-strategies)
5. [Volatility Strategies](#volatility-strategies)
6. [Advanced Strategies](#advanced-strategies)

---

## Basic Strategies

### 1. Long Call (Buy Call)
**Direction:** Bullish  
**Risk:** Limited (premium paid)  
**Reward:** Unlimited  
**Best For:** Strong bullish conviction

**How it works:**
- Buy a call option
- Profit if stock price rises above strike + premium
- Maximum loss = premium paid

**Example:**
- Buy AAPL $180 Call for $5
- Break-even: $185 ($180 + $5)
- Profit if AAPL > $185

---

### 2. Long Put (Buy Put)
**Direction:** Bearish  
**Risk:** Limited (premium paid)  
**Reward:** High (stock can go to $0)  
**Best For:** Bearish outlook or portfolio protection

**How it works:**
- Buy a put option
- Profit if stock price falls below strike - premium
- Maximum loss = premium paid

**Example:**
- Buy TSLA $250 Put for $8
- Break-even: $242 ($250 - $8)
- Profit if TSLA < $242

---

### 3. Covered Call
**Direction:** Neutral to Bullish  
**Risk:** Unlimited (stock can fall)  
**Reward:** Limited (premium + stock appreciation to strike)  
**Best For:** Generating income on owned stocks

**How it works:**
- Own 100 shares of stock
- Sell a call option against those shares
- Collect premium while limiting upside

**Example:**
- Own 100 AAPL shares at $180
- Sell $185 Call for $3
- Maximum profit: $800 ($500 stock gain + $300 premium)
- Stock gets called away at $185

---

### 4. Protective Put
**Direction:** Any (insurance)  
**Risk:** Limited (premium + stock loss)  
**Reward:** Unlimited (stock upside)  
**Best For:** Protecting long stock positions

**How it works:**
- Own stock
- Buy put option as insurance
- Limits downside while maintaining upside

**Example:**
- Own 100 MSFT shares at $380
- Buy $370 Put for $5
- Maximum loss: $1,500 (stock loss + premium)
- Protected below $370

---

## Bullish Strategies

### 5. Bull Call Spread
**Direction:** Bullish  
**Risk:** Limited (net premium paid)  
**Reward:** Limited (difference between strikes - net premium)  
**Best For:** Moderate bullish moves with defined risk

**How it works:**
- Buy lower strike call
- Sell higher strike call
- Same expiration
- Lower cost than long call

**Example:**
- Buy AAPL $180 Call for $5
- Sell AAPL $190 Call for $2
- Net cost: $3
- Maximum profit: $7 ($10 spread - $3 cost)
- Maximum loss: $3

---

### 6. Bull Put Spread
**Direction:** Bullish  
**Risk:** Limited (difference between strikes - net premium)  
**Reward:** Limited (net premium received)  
**Best For:** Bullish with limited move expected

**How it works:**
- Sell higher strike put
- Buy lower strike put
- Same expiration
- Collect premium

**Example:**
- Sell AAPL $175 Put for $3
- Buy AAPL $170 Put for $1
- Net credit: $2
- Maximum profit: $2 (if stock stays above $175)
- Maximum loss: $3 ($5 spread - $2 credit)

---

### 7. Call Debit Spread
**Direction:** Bullish  
**Risk:** Limited  
**Reward:** Limited  
**Best For:** Bullish outlook with cost efficiency

Same as Bull Call Spread - uses debit (buying lower, selling higher).

---

## Bearish Strategies

### 8. Bear Put Spread
**Direction:** Bearish  
**Risk:** Limited (net premium paid)  
**Reward:** Limited (difference between strikes - net premium)  
**Best For:** Moderate bearish moves

**How it works:**
- Buy higher strike put
- Sell lower strike put
- Same expiration

**Example:**
- Buy TSLA $250 Put for $8
- Sell TSLA $240 Put for $4
- Net cost: $4
- Maximum profit: $6 ($10 spread - $4 cost)
- Maximum loss: $4

---

### 9. Bear Call Spread
**Direction:** Bearish  
**Risk:** Limited (difference between strikes - net premium)  
**Reward:** Limited (net premium received)  
**Best For:** Bearish with limited move expected

**How it works:**
- Sell lower strike call
- Buy higher strike call
- Same expiration
- Collect premium

**Example:**
- Sell TSLA $260 Call for $5
- Buy TSLA $270 Call for $2
- Net credit: $3
- Maximum profit: $3 (if stock stays below $260)
- Maximum loss: $7 ($10 spread - $3 credit)

---

## Neutral Strategies

### 10. Iron Condor
**Direction:** Neutral  
**Risk:** Limited (difference between strikes - net credit)  
**Reward:** Limited (net premium received)  
**Best For:** Low volatility, range-bound markets

**How it works:**
- Sell put spread (bearish)
- Sell call spread (bullish)
- Same expiration
- Profit if stock stays in range

**Example:**
- Sell $175/$170 Put Spread
- Sell $185/$190 Call Spread
- Net credit: $2
- Profit zone: $175 to $185
- Maximum loss: $3 if stock moves outside range

---

### 11. Iron Butterfly
**Direction:** Neutral  
**Risk:** Limited  
**Reward:** Limited (net premium received)  
**Best For:** Very low volatility, stock at strike

**How it works:**
- Sell at-the-money call and put
- Buy out-of-the-money call and put
- Same expiration
- Profit if stock stays at strike

**Example:**
- Sell $180 Call and Put
- Buy $185 Call and $175 Put
- Net credit: $3
- Maximum profit at $180
- Profit zone: $177 to $183

---

### 12. Straddle
**Direction:** Volatile (non-directional)  
**Risk:** Limited (premium paid)  
**Reward:** Unlimited (both directions)  
**Best For:** High volatility expected, uncertain direction

**How it works:**
- Buy call and put at same strike
- Same expiration
- Profit if stock moves significantly either way

**Example:**
- Buy $180 Call for $5
- Buy $180 Put for $5
- Total cost: $10
- Break-even: $170 or $190
- Profit if stock moves > $10 in either direction

---

### 13. Strangle
**Direction:** Volatile (non-directional)  
**Risk:** Limited (premium paid)  
**Reward:** Unlimited  
**Best For:** High volatility, cheaper than straddle

**How it works:**
- Buy out-of-the-money call
- Buy out-of-the-money put
- Same expiration
- Lower cost than straddle

**Example:**
- Buy $185 Call for $3
- Buy $175 Put for $3
- Total cost: $6
- Profit if stock > $191 or < $169

---

### 14. Calendar Spread
**Direction:** Neutral to slightly directional  
**Risk:** Limited  
**Reward:** Limited  
**Best For:** Time decay plays, volatility changes

**How it works:**
- Sell short-term option
- Buy longer-term option
- Same strike
- Profits from time decay

**Example:**
- Sell $180 Call (expires in 1 week) for $2
- Buy $180 Call (expires in 1 month) for $5
- Net cost: $3
- Profit if stock stays near $180 and time decay works

---

## Volatility Strategies

### 15. Long Straddle
**Direction:** Volatile  
**Risk:** Limited (premium paid)  
**Reward:** Unlimited both ways  
**Best For:** Earnings, major announcements

Same as Straddle (#12).

---

### 16. Long Strangle
**Direction:** Volatile  
**Risk:** Limited (premium paid)  
**Reward:** Unlimited both ways  
**Best For:** Volatility plays, cheaper than straddle

Same as Strangle (#13).

---

### 17. Short Straddle
**Direction:** Low volatility  
**Risk:** Unlimited both ways  
**Reward:** Limited (premium received)  
**Best For:** High premium, low volatility expected

**How it works:**
- Sell call and put at same strike
- Collect premium
- Profit if stock stays near strike
- High risk strategy

---

### 18. Short Strangle
**Direction:** Low volatility  
**Risk:** Unlimited both ways  
**Reward:** Limited (premium received)  
**Best For:** Range-bound, collecting premium

**How it works:**
- Sell out-of-the-money call and put
- Collect premium
- Profit if stock stays in range
- Lower risk than short straddle

---

## Advanced Strategies

### 19. Collar
**Direction:** Neutral to slightly bullish  
**Risk:** Limited  
**Reward:** Limited  
**Best For:** Protecting large stock positions

**How it works:**
- Own stock
- Buy protective put
- Sell covered call
- Zero cost or net credit possible

**Example:**
- Own 100 AAPL shares at $180
- Buy $175 Put for $3
- Sell $185 Call for $3
- Zero cost collar
- Protected between $175-$185

---

### 20. Butterfly Spread
**Direction:** Neutral  
**Risk:** Limited  
**Reward:** Limited (maximum at middle strike)  
**Best For:** Precise price targets

**How it works:**
- Buy lower strike
- Sell 2 middle strikes
- Buy higher strike
- Same expiration
- Maximum profit at middle strike

**Example:**
- Buy $175 Call for $8
- Sell 2x $180 Calls for $5 each
- Buy $185 Call for $2
- Net cost: $0
- Maximum profit at $180

---

### 21. Diagonal Spread
**Direction:** Directional with time component  
**Risk:** Limited  
**Reward:** Limited  
**Best For:** Directional bias with time decay

**How it works:**
- Buy long-term option
- Sell short-term option
- Different strikes
- Profits from direction and time decay

---

### 22. Ratio Spread
**Direction:** Directional with limited risk  
**Risk:** Limited  
**Reward:** Unlimited  
**Best For:** Strong directional conviction

**How it works:**
- Buy 1 option at one strike
- Sell 2 options at different strike
- Same expiration
- Creates asymmetric risk/reward

---

## Strategy Selection Guide

### By Market Outlook:

**Very Bullish:**
- Long Call
- Bull Call Spread
- Call Debit Spread

**Moderately Bullish:**
- Covered Call
- Bull Put Spread
- Collar

**Neutral/Range-Bound:**
- Iron Condor
- Iron Butterfly
- Calendar Spread
- Short Strangle

**Volatile/Uncertain:**
- Long Straddle
- Long Strangle
- Butterfly Spread

**Bearish:**
- Long Put
- Bear Put Spread
- Bear Call Spread

---

## Risk Management Tips

1. **Always define your risk** - Know maximum loss before entering
2. **Use stop losses** - Exit if trade moves against you
3. **Position sizing** - Never risk more than 2-5% per trade
4. **Diversification** - Don't put all capital in one strategy
5. **Time decay awareness** - Theta affects all options
6. **Volatility understanding** - IV impacts option pricing
7. **Assignment risk** - Understand early assignment risks

---

## Key Greeks to Monitor

- **Delta:** Price sensitivity (directional risk)
- **Gamma:** Delta's rate of change
- **Theta:** Time decay (daily cost)
- **Vega:** Volatility sensitivity
- **Rho:** Interest rate sensitivity

---

## Important Disclaimers

⚠️ **Options trading involves significant risk and is not suitable for all investors.**
- You can lose your entire investment
- Options can expire worthless
- Early assignment can occur
- Margin requirements may apply
- Always do your own research
- Consider consulting a financial advisor

---

## Resources

- [Options Education - CBOE](https://www.cboe.com/learncenter/)
- [Options Trading Strategies - Investopedia](https://www.investopedia.com/options/)
- [Options Greeks Explained](https://www.investopedia.com/trading/options-greeks/)

---

*This guide is for educational purposes only and does not constitute financial advice.*

