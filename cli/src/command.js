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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.userDeposit = exports.runWholeEpoch = exports.withdraw = exports.unstake = exports.stake = exports.epochAutocompoundRewards = exports.syncBalances = exports.runInit = exports.displayValidators = exports.displayBalance = exports.displaySnapshot = void 0;
function near(amount) {
    return Math.round(amount).toString() + '0'.repeat(24);
}
function displaySnapshot(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = console).log;
                    return [4 /*yield*/, client.userAccounts()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.displaySnapshot = displaySnapshot;
function displayBalance(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = (_a = console).log;
                    _c = {};
                    return [4 /*yield*/, client.stakedBalance()];
                case 1:
                    _c.staked = (_d.sent()).toString();
                    return [4 /*yield*/, client.totalBalance()];
                case 2:
                    _b.apply(_a, [(_c.total = (_d.sent()).toString(),
                            _c)]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.displayBalance = displayBalance;
function displayValidators(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, validator;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0;
                    return [4 /*yield*/, client.validators()];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    validator = _a[_i];
                    console.log(validator);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.displayValidators = displayValidators;
// Used for tests only (at least for now):
function runInit(client, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('init');
                    return [4 /*yield*/, client.contract["new"]({
                            args: {
                                owner_account_id: accountId,
                                operator_account_id: accountId,
                                treasury_account_id: accountId
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runInit = runInit;
function syncBalances(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('sync balances');
                    return [4 /*yield*/, client.syncBalances()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.syncBalances = syncBalances;
function epochAutocompoundRewards(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('epoch autocompound');
                    return [4 /*yield*/, client.epochAutocompoundRewards()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.epochAutocompoundRewards = epochAutocompoundRewards;
function stake(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('epoch stake');
                    return [4 /*yield*/, client.epochStake()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.stake = stake;
function unstake(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('epoch unstake');
                    return [4 /*yield*/, client.epochUnstake()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.unstake = unstake;
function withdraw(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCommand('epoch withdraw');
                    return [4 /*yield*/, client.epochWithdraw()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.withdraw = withdraw;
function runWholeEpoch(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //await syncBalances(client);
                return [4 /*yield*/, epochAutocompoundRewards(client)];
                case 1:
                    //await syncBalances(client);
                    _a.sent();
                    return [4 /*yield*/, stake(client)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, unstake(client)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, withdraw(client)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runWholeEpoch = runWholeEpoch;
// User
function userDeposit(client) {
    return __awaiter(this, void 0, void 0, function () {
        var amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amount = near(2);
                    logCommand('user deposit:', amount);
                    return [4 /*yield*/, client.stake(amount)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.userDeposit = userDeposit;
// Utils
function logCommand() {
    var name = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        name[_i] = arguments[_i];
    }
    console.debug.apply(console, __spreadArray(['\n> Running'], name));
}
