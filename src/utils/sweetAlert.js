import Swal from 'sweetalert2'

// Custom theme configuration
const customTheme = {
    customClass: {
        popup: 'glass rounded-3xl',
        title: 'text-2xl font-bold',
        content: 'text-base',
        confirmButton: 'btn-primary px-6 py-3 rounded-xl font-medium',
        cancelButton: 'px-6 py-3 rounded-xl font-medium',
        denyButton: 'px-6 py-3 rounded-xl font-medium'
    },
    buttonsStyling: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, continue',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
}

// Success alert
export const showSuccess = (title, text = '') => {
    return Swal.fire({
        ...customTheme,
        icon: 'success',
        title,
        text,
        showCancelButton: false,
        confirmButtonText: 'Great!',
        customClass: {
            ...customTheme.customClass,
            confirmButton: 'btn-primary px-6 py-3 rounded-xl font-medium'
        }
    })
}

// Error alert
export const showError = (title, text = '') => {
    return Swal.fire({
        ...customTheme,
        icon: 'error',
        title,
        text,
        showCancelButton: false,
        confirmButtonText: 'Got it',
        customClass: {
            ...customTheme.customClass,
            confirmButton: 'px-6 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white'
        }
    })
}

// Confirmation dialog
export const showConfirm = (title, text = '', confirmText = 'Yes, delete it!') => {
    return Swal.fire({
        ...customTheme,
        icon: 'warning',
        title,
        text,
        confirmButtonText: confirmText,
        customClass: {
            ...customTheme.customClass,
            confirmButton: 'px-6 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white',
            cancelButton: 'px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
    })
}

// Loading alert
export const showLoading = (title = 'Loading...') => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}

// Close loading
export const closeLoading = () => {
    Swal.close()
}

// Input prompt
export const showInput = (title, text = '', inputType = 'text', placeholder = '') => {
    return Swal.fire({
        ...customTheme,
        title,
        text,
        input: inputType,
        inputPlaceholder: placeholder,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'Please enter a value!'
            }
        }
    })
}

// Toast notifications
export const showToast = (type, title, text = '') => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        customClass: {
            popup: 'glass rounded-2xl',
            title: 'text-sm font-medium',
            content: 'text-xs'
        }
    })

    return Toast.fire({
        icon: type,
        title,
        text
    })
}
