"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((key) => {
                    return {
                        [key]: { $regex: searchTerm, $options: 'i' },
                    };
                }),
            });
        }
        return this;
    }
    filter() {
        var _a;
        const filterData = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.filter;
        if (filterData) {
            this.modelQuery = this.modelQuery.find({ author: filterData });
        }
        return this;
    }
    select() {
        this.modelQuery = this.modelQuery.select('_id title content author');
        return this;
    }
    sort() {
        var _a, _b, _c, _d, _e, _f, _g;
        let sort;
        if (((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sortOrder) == 'asc') {
            sort =
                ((_d = (_c = (_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.sortBy) === null || _c === void 0 ? void 0 : _c.split(',')) === null || _d === void 0 ? void 0 : _d.join(' ')) ||
                    'createdAt';
        }
        else {
            const sortQuery = (_g = (_f = (_e = this === null || this === void 0 ? void 0 : this.query) === null || _e === void 0 ? void 0 : _e.sortBy) === null || _f === void 0 ? void 0 : _f.split(',')) === null || _g === void 0 ? void 0 : _g.join('-');
            if (sortQuery) {
                sort = `-${sortQuery}`;
            }
            else {
                sort = '-createdAt';
            }
        }
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
}
exports.default = QueryBuilder;
