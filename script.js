class UAFCalculator {
    constructor() {
        this.formData = {
            matricObtained: '',
            matricTotal: '',
            interObtained: '',
            interTotal: '',
            entryTestObtained: ''
        };
        this.errors = {};
        this.isCalculating = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('matricObtained').addEventListener('input', (e) => this.handleInputChange('matricObtained', e.target.value));
        document.getElementById('matricTotal').addEventListener('input', (e) => this.handleInputChange('matricTotal', e.target.value));
        document.getElementById('interObtained').addEventListener('input', (e) => this.handleInputChange('interObtained', e.target.value));
        document.getElementById('interTotal').addEventListener('input', (e) => this.handleInputChange('interTotal', e.target.value));
        document.getElementById('entryTestObtained').addEventListener('input', (e) => this.handleInputChange('entryTestObtained', e.target.value));

        document.getElementById('calculateBtn').addEventListener('click', () => this.calculateAggregate());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCalculator());
    }

    validateField(name, value) {
        const numValue = parseFloat(value);

        if (!value.trim()) {
            return "This field is required";
        }

        if (isNaN(numValue) || numValue < 0) {
            return "Enter a valid number";
        }

        if (name === "matricObtained" && this.formData.matricTotal) {
            const total = parseFloat(this.formData.matricTotal);
            if (numValue > total) return "Obtained marks cannot exceed total marks";
        }

        if (name === "matricTotal" && this.formData.matricObtained) {
            const obtained = parseFloat(this.formData.matricObtained);
            if (obtained > numValue) return "Total must be greater than obtained";
        }

        if (name === "interObtained" && this.formData.interTotal) {
            const total = parseFloat(this.formData.interTotal);
            if (numValue > total) return "Obtained marks cannot exceed total marks";
        }

        if (name === "interTotal" && this.formData.interObtained) {
            const obtained = parseFloat(this.formData.interObtained);
            if (obtained > numValue) return "Total must be greater than obtained";
        }

        if (name === "entryTestObtained" && numValue > 100) {
            return "Entry test marks cannot exceed 100";
        }

        return null;
    }

    handleInputChange(name, value) {
        this.formData[name] = value;
        const error = this.validateField(name, value);
        this.errors[name] = error;
        this.updateFieldError(name, error);
        this.updateButtonState();
        this.hideResult();
    }

    updateFieldError(fieldName, error) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (error) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.classList.remove('hidden');
            }
        } else {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.classList.add('hidden');
                errorElement.textContent = '';
            }
        }
    }

    updateButtonState() {
        const btn = document.getElementById('calculateBtn');
        const hasErrors = Object.values(this.errors).some(error => error !== null);
        const hasEmptyFields = Object.values(this.formData).some(value => !value.trim());
        btn.disabled = this.isCalculating || hasErrors || hasEmptyFields;
    }

    validateForm() {
        let isValid = true;

        Object.keys(this.formData).forEach(key => {
            const error = this.validateField(key, this.formData[key]);
            this.errors[key] = error;
            this.updateFieldError(key, error);
            if (error) isValid = false;
        });

        return isValid;
    }

    async calculateAggregate() {
        if (!this.validateForm()) return;

        this.isCalculating = true;
        this.showCalculating();

        await new Promise(resolve => setTimeout(resolve, 500));

        const matricPercentage = (parseFloat(this.formData.matricObtained) / parseFloat(this.formData.matricTotal)) * 100;
        const interPercentage = (parseFloat(this.formData.interObtained) / parseFloat(this.formData.interTotal)) * 100;
        const entryTestPercentage = (parseFloat(this.formData.entryTestObtained) / 100) * 100;

        const aggregate = (matricPercentage * 0.30) + (interPercentage * 0.30) + (entryTestPercentage * 0.40);

        this.showResult(aggregate);
        this.isCalculating = false;
        this.hideCalculating();
        this.updateButtonState();
    }

    showCalculating() {
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('spinner');

        if (btnText) btnText.textContent = 'Calculating...';
        if (spinner) spinner.classList.remove('hidden');
    }

    hideCalculating() {
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('spinner');

        if (btnText) btnText.textContent = 'Calculate Aggregate';
        if (spinner) spinner.classList.add('hidden');
    }

    showResult(aggregate) {
        const resultValue = document.getElementById('resultValue');
        const resultSection = document.getElementById('resultSection');

        if (resultValue) resultValue.textContent = aggregate.toFixed(2) + '%';
        if (resultSection) resultSection.classList.remove('hidden');
    }

    hideResult() {
        const resultSection = document.getElementById('resultSection');
        if (resultSection) resultSection.classList.add('hidden');
    }

    resetCalculator() {
        this.formData = {
            matricObtained: '',
            matricTotal: '',
            interObtained: '',
            interTotal: '',
            entryTestObtained: ''
        };

        document.getElementById('matricObtained').value = '';
        document.getElementById('matricTotal').value = '';
        document.getElementById('interObtained').value = '';
        document.getElementById('interTotal').value = '';
        document.getElementById('entryTestObtained').value = '';

        this.errors = {};
        this.updateButtonState();
        this.hideResult();

        ['matricObtained', 'matricTotal', 'interObtained', 'interTotal', 'entryTestObtained'].forEach(id => {
            this.updateFieldError(id, null);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new UAFCalculator());

console.log("@uaf_coder");