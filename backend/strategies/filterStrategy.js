class FilterStrategy {
    apply(filter, value) {
        throw new Error('apply() must be implemented');
    }
}

// Filter by gender
class GenderFilterStrategy extends FilterStrategy {
    apply(filter, value) {
        filter.gender = value;
        return filter;
    }
}

// Filter by blood type
class BloodTypeFilterStrategy extends FilterStrategy {
    apply(filter, value) {
        filter.bloodType = value;
        return filter;
    }
}

// Search by diagnosis keyword
class DiagnosisFilterStrategy extends FilterStrategy {
    apply(filter, value) {
        filter.diagnosis = { $regex: value, $options: 'i' };
        return filter;
    }
}

class RecordFilter {
    constructor() {
        this.strategies = {
            gender: new GenderFilterStrategy(),
            bloodType: new BloodTypeFilterStrategy(),
            diagnosis: new DiagnosisFilterStrategy()
        };
    }

    buildFilter(query) {
        let filter = {};
        for (const [key, strategy] of Object.entries(this.strategies)) {
            if (query[key]) {
                strategy.apply(filter, query[key]);
            }
        }
        return filter;
    }
}

module.exports = RecordFilter;