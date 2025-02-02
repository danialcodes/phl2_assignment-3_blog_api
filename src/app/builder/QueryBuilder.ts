import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.search;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((key) => {
                    return {
                        [key]: { $regex: searchTerm, $options: 'i' },
                    } as FilterQuery<T>;
                }),
            });
        }
        return this;
    }

    filter() {
        const filterData = this?.query?.filter;

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
        let sort: string;
        if (this?.query?.sortOrder == 'asc') {
            sort =
                (this?.query?.sortBy as string)?.split(',')?.join(' ') ||
                'createdAt';
        } else {
            const sortQuery =
                (this?.query?.sortBy as string)?.split(',')?.join('-')
            if(sortQuery) {
                sort = `-${sortQuery}`;
            }else{
                sort = '-createdAt';
            }
        }
        this.modelQuery = this.modelQuery.sort(sort as string);
        return this;
    }
}

export default QueryBuilder;
