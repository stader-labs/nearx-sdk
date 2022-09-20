"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var nearx = require("nearx-js");
var command = require("./command");
var commands = {
    // Read:
    validators: command.displayValidators,
    epoch: function (client) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = console).log;
                return [4 /*yield*/, client.currentEpoch()];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        }
    }); }); },
    snapshot: command.displaySnapshot,
    balance: command.displayBalance,
    // Operation:
    init: command.runInit,
    'sync-balances': command.syncBalances,
    autocompound: command.epochAutocompoundRewards,
    stake: command.stake,
    unstake: command.unstake,
    withdraw: command.withdraw,
    all: command.runWholeEpoch,
    // User:
    deposit: command.userDeposit
};
function run(networkContract, accountId, commandName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, network_, contractName, rest, network, client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = networkContract.split(':'), network_ = _a[0], contractName = _a[1], rest = _a.slice(2);
                    if (rest.length != 0) {
                        error('Invalid network and contract name');
                    }
                    if (!(commandName in commands)) return [3 /*break*/, 3];
                    network = typedNetwork(network_);
                    accountId = canonicalAccountId(network, accountId);
                    return [4 /*yield*/, nearx.NearxPoolClient["new"](network, contractName, accountId)];
                case 1:
                    client = _b.sent();
                    return [4 /*yield*/, commands[commandName](client, accountId)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    if (commandName != null) {
                        console.error('Undefined command:', commandName);
                    }
                    error();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function error(message) {
    console.error(message !== null && message !== void 0 ? message : help);
    process.exit(1);
}
var help = "Usage:\n\n./nearx <network>:<contract name> <account ID> COMMAND\n    COMMAND: " + Object.keys(commands).join(' | ');
run(process.argv[2], process.argv[3], process.argv[4]).then(function () {
    return console.log('Command successfully executed');
});
function typedNetwork(s) {
    switch (s) {
        case 'testnet':
        case 'mainnet':
            return s;
        default:
            error("Invalid network: " + s);
    }
}
function canonicalAccountId(networkId, accountId) {
    if (accountId.split('.')[1] != undefined) {
        return accountId;
    }
    switch (networkId) {
        case 'mainnet':
            return accountId + '.near';
        case 'testnet':
            return accountId + '.testnet';
        default:
            throw new Error('Invalid network: ' + networkId);
    }
}
