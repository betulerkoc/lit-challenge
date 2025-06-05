export interface Translations {
  [key: string]: {
    en: string;
    tr: string;
  };
}

export const translations: Translations = {
  'nav.employees': {
    en: 'Employees',
    tr: 'Çalışanlar'
  },
  'nav.addNew': {
    en: 'Add New',
    tr: 'Yeni Kayıt'
  },

  'form.title.add': {
    en: 'Add New Employee',
    tr: 'Yeni Çalışan Ekle'
  },
  'form.title.edit': {
    en: 'Edit Employee',
    tr: 'Çalışanı Düzenle'
  },
  'form.firstName': {
    en: 'First Name',
    tr: 'Ad'
  },
  'form.lastName': {
    en: 'Last Name',
    tr: 'Soyad'
  },
  'form.dateOfEmployment': {
    en: 'Date of Employment',
    tr: 'İşe Başlama Tarihi'
  },
  'form.dateOfBirth': {
    en: 'Date of Birth',
    tr: 'Doğum Tarihi'
  },
  'form.phoneNumber': {
    en: 'Phone Number',
    tr: 'Telefon Numarası'
  },
  'form.email': {
    en: 'Email Address',
    tr: 'E-posta Adresi'
  },
  'form.department': {
    en: 'Department',
    tr: 'Departman'
  },
  'form.position': {
    en: 'Position',
    tr: 'Pozisyon'
  },
  'form.submit.add': {
    en: 'Create Employee',
    tr: 'Çalışan Oluştur'
  },
  'form.submit.edit': {
    en: 'Update Employee',
    tr: 'Çalışanı Güncelle'
  },

  'validation.firstName.required': {
    en: 'First name is required',
    tr: 'Ad alanı zorunludur'
  },
  'validation.firstName.format': {
    en: 'First name should only contain letters, spaces, hyphens, and apostrophes (2-50 characters)',
    tr: 'Ad sadece harf, boşluk, tire ve kesme işareti içerebilir (2-50 karakter)'
  },
  'validation.lastName.required': {
    en: 'Last name is required',
    tr: 'Soyad alanı zorunludur'
  },
  'validation.lastName.format': {
    en: 'Last name should only contain letters, spaces, hyphens, and apostrophes (2-50 characters)',
    tr: 'Soyad sadece harf, boşluk, tire ve kesme işareti içerebilir (2-50 karakter)'
  },
  'validation.dateOfEmployment.required': {
    en: 'Date of employment is required',
    tr: 'İşe başlama tarihi zorunludur'
  },
  'validation.dateOfEmployment.future': {
    en: 'Date of employment cannot be in the future',
    tr: 'İşe başlama tarihi gelecekte olamaz'
  },
  'validation.dateOfBirth.required': {
    en: 'Date of birth is required',
    tr: 'Doğum tarihi zorunludur'
  },
  'validation.dateOfBirth.future': {
    en: 'Date of birth cannot be in the future',
    tr: 'Doğum tarihi gelecekte olamaz'
  },
  'validation.dateOfBirth.age': {
    en: 'Employee must be at least 18 years old',
    tr: 'Çalışan en az 18 yaşında olmalıdır'
  },
  'validation.phoneNumber.required': {
    en: 'Phone number is required',
    tr: 'Telefon numarası zorunludur'
  },
  'validation.phoneNumber.format': {
    en: 'Please enter a valid phone number (10-15 digits)',
    tr: 'Lütfen geçerli bir telefon numarası girin (10-15 rakam)'
  },
  'validation.email.required': {
    en: 'Email is required',
    tr: 'E-posta adresi zorunludur'
  },
  'validation.email.format': {
    en: 'Please enter a valid email address',
    tr: 'Lütfen geçerli bir e-posta adresi girin'
  },
  'validation.email.unique': {
    en: 'This email address is already registered in the system',
    tr: 'Bu e-posta adresi sistemde zaten kayıtlı'
  },

  'alert.updateConfirm': {
    en: 'Are you sure you want to update this employee record?',
    tr: 'Bu çalışan kaydını güncellemek istediğinizden emin misiniz?'
  },
  'alert.updateSuccess': {
    en: 'Employee record updated successfully!',
    tr: 'Çalışan kaydı başarıyla güncellendi!'
  },
  'alert.createSuccess': {
    en: 'Employee record created successfully!',
    tr: 'Çalışan kaydı başarıyla oluşturuldu!'
  },
  'alert.error': {
    en: 'An error occurred while saving the employee record.',
    tr: 'Çalışan kaydı kaydedilirken bir hata oluştu.'
  },

  'department.analytics': {
    en: 'Analytics',
    tr: 'Analitik'
  },
  'department.tech': {
    en: 'Tech',
    tr: 'Teknoloji'
  },

  'position.junior': {
    en: 'Junior',
    tr: 'Junior'
  },
  'position.medior': {
    en: 'Medior',
    tr: 'Medior'
  },
  'position.senior': {
    en: 'Senior',
    tr: 'Senior'
  },

  'employeeList.title': {
    en: 'Employee List',
    tr: 'Çalışan Listesi'
  },
  'employeeList.actions': {
    en: 'Actions',
    tr: 'İşlemler'
  }
}; 