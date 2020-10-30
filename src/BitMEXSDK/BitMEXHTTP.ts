import { BitMEXMessage } from './BitMEXMessage'
import { BitMEXHTTP__call } from './BitMEXHTTP__call'

export const BitMEXHTTP = {

    Announcement: {

        get: (cookie: string, req: {
            columns?: string /* Array of column names to fetch. If omitted, will return all columns. */
        }) => BitMEXHTTP__call<BitMEXMessage.Announcement[]>({ cookie, method: 'GET', path: '/api/v1/announcement', req }),

        getUrgent: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Announcement[]>({ cookie, method: 'GET', path: '/api/v1/announcement/urgent', req })
    },

    APIKey: {

        get: (cookie: string, req: {
            reverse?: boolean /* If true, will sort results newest first. */
        }) => BitMEXHTTP__call<BitMEXMessage.APIKey[]>({ cookie, method: 'GET', path: '/api/v1/apiKey', req })
    },

    Chat: {

        get: (cookie: string, req: {
            count?: number /* Number of results to fetch. */
            start?: number /* Starting ID for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            channelID?: number /* Channel id. GET /chat/channels for ids. Leave blank for all. */
        }) => BitMEXHTTP__call<BitMEXMessage.Chat[]>({ cookie, method: 'GET', path: '/api/v1/chat', req }),

        new: (cookie: string, req: {
            message: string /*  */
            channelID?: number /* Channel to post to. Default 1 (English). */
        }) => BitMEXHTTP__call<BitMEXMessage.Chat>({ cookie, method: 'POST', path: '/api/v1/chat', req }),

        getChannels: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.ChatChannel[]>({ cookie, method: 'GET', path: '/api/v1/chat/channels', req }),

        getConnected: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.ConnectedUsers>({ cookie, method: 'GET', path: '/api/v1/chat/connected', req })
    },

    Execution: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Execution[]>({ cookie, method: 'GET', path: '/api/v1/execution', req }),

        getTradeHistory: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Execution[]>({ cookie, method: 'GET', path: '/api/v1/execution/tradeHistory', req })
    },

    Funding: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Funding[]>({ cookie, method: 'GET', path: '/api/v1/funding', req })
    },

    Instrument: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Instrument[]>({ cookie, method: 'GET', path: '/api/v1/instrument', req }),

        getActive: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Instrument[]>({ cookie, method: 'GET', path: '/api/v1/instrument/active', req }),

        getIndices: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Instrument[]>({ cookie, method: 'GET', path: '/api/v1/instrument/indices', req }),

        getActiveAndIndices: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Instrument[]>({ cookie, method: 'GET', path: '/api/v1/instrument/activeAndIndices', req }),

        getActiveIntervals: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.InstrumentInterval>({ cookie, method: 'GET', path: '/api/v1/instrument/activeIntervals', req }),

        getCompositeIndex: (cookie: string, req: {
            symbol?: string /* The composite index symbol. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.IndexComposite[]>({ cookie, method: 'GET', path: '/api/v1/instrument/compositeIndex', req })
    },

    Insurance: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Insurance[]>({ cookie, method: 'GET', path: '/api/v1/insurance', req })
    },

    Leaderboard: {

        get: (cookie: string, req: {
            method?: string /* Ranking type. Options: "notional", "ROE" */
        }) => BitMEXHTTP__call<BitMEXMessage.Leaderboard[]>({ cookie, method: 'GET', path: '/api/v1/leaderboard', req }),

        getName: (cookie: string, req: {}) => BitMEXHTTP__call<{ name: string }>({ cookie, method: 'GET', path: '/api/v1/leaderboard/name', req })
    },

    Liquidation: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Liquidation[]>({ cookie, method: 'GET', path: '/api/v1/liquidation', req })
    },

    GlobalNotification: {

        get: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.GlobalNotification[]>({ cookie, method: 'GET', path: '/api/v1/globalNotification', req })
    },

    Order: {

        getOrders: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order[]>({ cookie, method: 'GET', path: '/api/v1/order', req }),

        new: (cookie: string, req: {
            symbol: string /* Instrument symbol. e.g. 'XBTUSD'. */
            side?: 'Buy' | 'Sell' /* Order side. Valid options: Buy, Sell. Defaults to 'Buy' unless `orderQty` is negative. */
            simpleOrderQty?: number /* Deprecated: simple orders are not supported after 2018/10/26 */
            orderQty?: number /* Order quantity in units of the instrument (i.e. contracts). */
            price?: number /* Optional limit price for 'Limit', 'StopLimit', and 'LimitIfTouched' orders. */
            displayQty?: number /* Optional quantity to display in the book. Use 0 for a fully hidden order. */
            stopPx?: number /* Optional trigger price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders. Use a price below the current price for stop-sell orders and buy-if-touched orders. Use `execInst` of 'MarkPrice' or 'LastPrice' to define the current price used for triggering. */
            clOrdID?: string /* Optional Client Order ID. This clOrdID will come back on the order and any related executions. */
            clOrdLinkID?: string /* Deprecated: linked orders are not supported after 2018/11/10. */
            pegOffsetValue?: number /* Optional trailing offset from the current price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders; use a negative offset for stop-sell orders and buy-if-touched orders. Optional offset from the peg price for 'Pegged' orders. */
            pegPriceType?: 'MarketPeg' | 'PrimaryPeg' | 'TrailingStopPeg' /* Optional peg price type. Valid options: MarketPeg, PrimaryPeg, TrailingStopPeg. */
            ordType?: 'Market' | 'Limit' | 'Stop' | 'StopLimit' | 'MarketIfTouched' | 'LimitIfTouched' | 'Pegged' /* Order type. Valid options: Market, Limit, Stop, StopLimit, MarketIfTouched, LimitIfTouched, Pegged. Defaults to 'Limit' when `price` is specified. Defaults to 'Stop' when `stopPx` is specified. Defaults to 'StopLimit' when `price` and `stopPx` are specified. */
            timeInForce?: 'Day' | 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill' /* Time in force. Valid options: Day, GoodTillCancel, ImmediateOrCancel, FillOrKill. Defaults to 'GoodTillCancel' for 'Limit', 'StopLimit', and 'LimitIfTouched' orders. */
            execInst?: 'ParticipateDoNotInitiate' | 'AllOrNone' | 'MarkPrice' | 'IndexPrice' | 'LastPrice' | 'Close' | 'ReduceOnly' | 'Fixed' | 'LastWithinMark' /* Optional execution instructions. Valid options: ParticipateDoNotInitiate, AllOrNone, MarkPrice, IndexPrice, LastPrice, Close, ReduceOnly, Fixed, LastWithinMark. 'AllOrNone' instruction requires `displayQty` to be 0. 'MarkPrice', 'IndexPrice' or 'LastPrice' instruction valid for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders. 'LastWithinMark' instruction valid for 'Stop' and 'StopLimit' with instruction 'LastPrice'. */
            contingencyType?: string /* Deprecated: linked orders are not supported after 2018/11/10. */
            text?: string /* Optional order annotation. e.g. 'Take profit'. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order>({ cookie, method: 'POST', path: '/api/v1/order', req }),

        amend: (cookie: string, req: {
            orderID?: string /* Order ID */
            origClOrdID?: string /* Client Order ID. See POST /order. */
            clOrdID?: string /* Optional new Client Order ID, requires `origClOrdID`. */
            simpleOrderQty?: number /* Deprecated: simple orders are not supported after 2018/10/26 */
            orderQty?: number /* Optional order quantity in units of the instrument (i.e. contracts). */
            simpleLeavesQty?: number /* Deprecated: simple orders are not supported after 2018/10/26 */
            leavesQty?: number /* Optional leaves quantity in units of the instrument (i.e. contracts). Useful for amending partially filled orders. */
            price?: number /* Optional limit price for 'Limit', 'StopLimit', and 'LimitIfTouched' orders. */
            stopPx?: number /* Optional trigger price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders. Use a price below the current price for stop-sell orders and buy-if-touched orders. */
            pegOffsetValue?: number /* Optional trailing offset from the current price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders; use a negative offset for stop-sell orders and buy-if-touched orders. Optional offset from the peg price for 'Pegged' orders. */
            text?: string /* Optional amend annotation. e.g. 'Adjust skew'. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order>({ cookie, method: 'PUT', path: '/api/v1/order', req }),

        cancel: (cookie: string, req: {
            orderID?: string /* Order ID(s). */
            clOrdID?: string /* Client Order ID(s). See POST /order. */
            text?: string /* Optional cancellation annotation. e.g. 'Spread Exceeded'. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order[]>({ cookie, method: 'DELETE', path: '/api/v1/order', req }),

        newBulk: (cookie: string, req: {
            orders?: string /* An array of orders. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order[]>({ cookie, method: 'POST', path: '/api/v1/order/bulk', req }),

        amendBulk: (cookie: string, req: {
            orders?: string /* An array of orders. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order[]>({ cookie, method: 'PUT', path: '/api/v1/order/bulk', req }),

        closePosition: (cookie: string, req: {
            symbol: string /* Symbol of position to close. */
            price?: number /* Optional limit price. */
        }) => BitMEXHTTP__call<BitMEXMessage.Order>({ cookie, method: 'POST', path: '/api/v1/order/closePosition', req }),

        cancelAll: (cookie: string, req: {
            symbol?: string /* Optional symbol. If provided, only cancels orders for that symbol. */
            filter?: string /* Optional filter for cancellation. Use to only cancel some orders, e.g. `{"side": "Buy"}`. */
            text?: string /* Optional cancellation annotation. e.g. 'Spread Exceeded' */
        }) => BitMEXHTTP__call<BitMEXMessage.Order[]>({ cookie, method: 'DELETE', path: '/api/v1/order/all', req }),

        cancelAllAfter: (cookie: string, req: {
            timeout: number /* Timeout in ms. Set to 0 to cancel this timer.  */
        }) => BitMEXHTTP__call<{}>({ cookie, method: 'POST', path: '/api/v1/order/cancelAllAfter', req })
    },

    OrderBook: {

        getL2: (cookie: string, req: {
            symbol: string /* Instrument symbol. Send a series (e.g. XBT) to get data for the nearest contract in that series. */
            depth?: number /* Orderbook depth per side. Send 0 for full depth. */
        }) => BitMEXHTTP__call<BitMEXMessage.OrderBookL2[]>({ cookie, method: 'GET', path: '/api/v1/orderBook/L2', req })
    },

    Position: {

        get: (cookie: string, req: {
            filter?: string /* Table filter. For example, send {"symbol": "XBTUSD"}. */
            columns?: string /* Which columns to fetch. For example, send ["columnName"]. */
            count?: number /* Number of rows to fetch. */
        }) => BitMEXHTTP__call<BitMEXMessage.Position[]>({ cookie, method: 'GET', path: '/api/v1/position', req }),

        isolateMargin: (cookie: string, req: {
            symbol: string /* Position symbol to isolate. */
            enabled?: boolean /* True for isolated margin, false for cross margin. */
        }) => BitMEXHTTP__call<BitMEXMessage.Position>({ cookie, method: 'POST', path: '/api/v1/position/isolate', req }),

        updateRiskLimit: (cookie: string, req: {
            symbol: string /* Symbol of position to update risk limit on. */
            riskLimit: number /* New Risk Limit, in Satoshis. */
        }) => BitMEXHTTP__call<BitMEXMessage.Position>({ cookie, method: 'POST', path: '/api/v1/position/riskLimit', req }),

        transferIsolatedMargin: (cookie: string, req: {
            symbol: string /* Symbol of position to isolate. */
            amount: number /* Amount to transfer, in Satoshis. May be negative. */
        }) => BitMEXHTTP__call<BitMEXMessage.Position>({ cookie, method: 'POST', path: '/api/v1/position/transferMargin', req }),

        updateLeverage: (cookie: string, req: {
            symbol: string /* Symbol of position to adjust. */
            leverage: number /* Leverage value. Send a number between 0.01 and 100 to enable isolated margin with a fixed leverage. Send 0 to enable cross margin. */
        }) => BitMEXHTTP__call<BitMEXMessage.Position>({ cookie, method: 'POST', path: '/api/v1/position/leverage', req })
    },

    Quote: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Quote[]>({ cookie, method: 'GET', path: '/api/v1/quote', req }),

        getBucketed: (cookie: string, req: {
            binSize?: '1m' | '5m' | '1h' | '1d' /* Time interval to bucket by. Available options: [1m,5m,1h,1d]. */
            partial?: boolean /* If true, will send in-progress (incomplete) bins for the current time period. */
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Quote[]>({ cookie, method: 'GET', path: '/api/v1/quote/bucketed', req })
    },

    Schema: {

        get: (cookie: string, req: {
            model?: string /* Optional model filter. If omitted, will return all models. */
        }) => BitMEXHTTP__call<{}>({ cookie, method: 'GET', path: '/api/v1/schema', req }),

        websocketHelp: (cookie: string, req: {}) => BitMEXHTTP__call<{}>({ cookie, method: 'GET', path: '/api/v1/schema/websocketHelp', req })
    },

    Settlement: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Settlement[]>({ cookie, method: 'GET', path: '/api/v1/settlement', req })
    },

    Stats: {

        get: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Stats[]>({ cookie, method: 'GET', path: '/api/v1/stats', req }),

        history: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.StatsHistory[]>({ cookie, method: 'GET', path: '/api/v1/stats/history', req }),

        historyUSD: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.StatsUSD[]>({ cookie, method: 'GET', path: '/api/v1/stats/historyUSD', req })
    },

    Trade: {

        get: (cookie: string, req: {
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Trade[]>({ cookie, method: 'GET', path: '/api/v1/trade', req }),

        getBucketed: (cookie: string, req: {
            binSize?: '1m' | '5m' | '1h' | '1d' /* Time interval to bucket by. Available options: [1m,5m,1h,1d]. */
            partial?: boolean /* If true, will send in-progress (incomplete) bins for the current time period. */
            symbol?: string /* Instrument symbol. Send a bare series (e.g. XBT) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBT:quarterly`. Timeframes are `nearest`, `daily`, `weekly`, `monthly`, `quarterly`, `biquarterly`, and `perpetual`. */
            filter?: string /* Generic table filter. Send JSON key/value pairs, such as `{"key": "value"}`. You can key on individual fields, and do more advanced querying on timestamps. See the [Timestamp Docs](https://www.bitmex.com/app/restAPI#Timestamp-Filters) for more details. */
            columns?: string /* Array of column names to fetch. If omitted, will return all columns.

Note that this method will always return item keys, even when not specified, so you may receive more columns that you expect. */
            count?: number /* Number of results to fetch. Must be a positive integer. */
            start?: number /* Starting point for results. */
            reverse?: boolean /* If true, will sort results newest first. */
            startTime?: string /* Starting date filter for results. */
            endTime?: string /* Ending date filter for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.TradeBin[]>({ cookie, method: 'GET', path: '/api/v1/trade/bucketed', req })
    },

    User: {

        getDepositAddress: (cookie: string, req: {
            currency?: string /*  */
        }) => BitMEXHTTP__call<string>({ cookie, method: 'GET', path: '/api/v1/user/depositAddress', req }),

        getWallet: (cookie: string, req: {
            currency?: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.Wallet>({ cookie, method: 'GET', path: '/api/v1/user/wallet', req }),

        getWalletHistory: (cookie: string, req: {
            currency?: string /*  */
            count?: number /* Number of results to fetch. */
            start?: number /* Starting point for results. */
        }) => BitMEXHTTP__call<BitMEXMessage.Transaction[]>({ cookie, method: 'GET', path: '/api/v1/user/walletHistory', req }),

        getWalletSummary: (cookie: string, req: {
            currency?: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.Transaction[]>({ cookie, method: 'GET', path: '/api/v1/user/walletSummary', req }),

        getExecutionHistory: (cookie: string, req: {
            symbol: string /*  */
            timestamp: string /*  */
        }) => BitMEXHTTP__call<{}>({ cookie, method: 'GET', path: '/api/v1/user/executionHistory', req }),

        minWithdrawalFee: (cookie: string, req: {
            currency?: string /*  */
        }) => BitMEXHTTP__call<{}>({ cookie, method: 'GET', path: '/api/v1/user/minWithdrawalFee', req }),

        requestWithdrawal: (cookie: string, req: {
            otpToken?: string /* 2FA token. Required if 2FA is enabled on your account. */
            currency: string /* Currency you're withdrawing. Options: `XBt` */
            amount: number /* Amount of withdrawal currency. */
            address?: string /* Destination Address. One of `address`, `addressId`, `targetUserId` has to be specified. */
            addressId?: number /* ID of the Destination Address. One of `address`, `targetUserId`, `targetUserId` has to be specified. */
            targetUserId?: number /* ID of the Target User. One of `address`, `addressId`, `targetUserId` has to be specified. */
            fee?: number /* Network fee for Bitcoin withdrawals. If not specified, a default value will be calculated based on Bitcoin network conditions. You will have a chance to confirm this via email. */
            text?: string /* Optional annotation, e.g. 'Transfer to home wallet'. */
        }) => BitMEXHTTP__call<BitMEXMessage.Transaction>({ cookie, method: 'POST', path: '/api/v1/user/requestWithdrawal', req }),

        cancelWithdrawal: (cookie: string, req: {
            token: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.Transaction>({ cookie, method: 'POST', path: '/api/v1/user/cancelWithdrawal', req }),

        confirmWithdrawal: (cookie: string, req: {
            token: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.Transaction>({ cookie, method: 'POST', path: '/api/v1/user/confirmWithdrawal', req }),

        confirm: (cookie: string, req: {
            token: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.AccessToken>({ cookie, method: 'POST', path: '/api/v1/user/confirmEmail', req }),

        getAffiliateStatus: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.Affiliate>({ cookie, method: 'GET', path: '/api/v1/user/affiliateStatus', req }),

        checkReferralCode: (cookie: string, req: {
            referralCode?: string /*  */
        }) => BitMEXHTTP__call<number>({ cookie, method: 'GET', path: '/api/v1/user/checkReferralCode', req }),

        getQuoteFillRatio: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.QuoteFillRatio>({ cookie, method: 'GET', path: '/api/v1/user/quoteFillRatio', req }),

        getQuoteValueRatio: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.QuoteValueRatio>({ cookie, method: 'GET', path: '/api/v1/user/quoteValueRatio', req }),

        logout: (cookie: string, req: {}) => BitMEXHTTP__call<null>({ cookie, method: 'POST', path: '/api/v1/user/logout', req }),

        savePreferences: (cookie: string, req: {
            prefs: string /*  */
            overwrite?: boolean /* If true, will overwrite all existing preferences. */
        }) => BitMEXHTTP__call<BitMEXMessage.User>({ cookie, method: 'POST', path: '/api/v1/user/preferences', req }),

        get: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.User>({ cookie, method: 'GET', path: '/api/v1/user', req }),

        getCommission: (cookie: string, req: {}) => BitMEXHTTP__call<BitMEXMessage.UserCommissionsBySymbol>({ cookie, method: 'GET', path: '/api/v1/user/commission', req }),

        getMargin: (cookie: string, req: {
            currency?: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.Margin>({ cookie, method: 'GET', path: '/api/v1/user/margin', req }),

        communicationToken: (cookie: string, req: {
            token: string /*  */
            platformAgent: string /*  */
        }) => BitMEXHTTP__call<BitMEXMessage.CommunicationToken[]>({ cookie, method: 'POST', path: '/api/v1/user/communicationToken', req })
    },

    UserEvent: {

        get: (cookie: string, req: {
            count?: number /* Number of results to fetch. */
            startId?: number /* Cursor for pagination. */
        }) => BitMEXHTTP__call<BitMEXMessage.UserEvent[]>({ cookie, method: 'GET', path: '/api/v1/userEvent', req })
    }
}