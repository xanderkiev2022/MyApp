export const formatBirthDate = value => {
  const cleaned = value.replace(/\D/g, ''); // Видаляємо всі нецифрові символи
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/); // Розбиваємо на групи (DD, MM, YYYY)
  let formattedDate = '';
  if (match) {
    const [, day, month, year] = match;
    formattedDate = '';

    if (day) {
      formattedDate += day;
      if (month) {
        formattedDate += '.' + month;
        if (year) {
          formattedDate += '.' + year;
          if (year.length > 3) {
            const age = calculateAge(`${day}.${month}.${year}`);
            if (age > 80 || age < 15) {
              alert(`Перевірте правильність введення дати, Вам ${age}?`);
            } else console.log('Формат дати вірний');
          }
        }
      }
    }
  }

  return formattedDate;
};

export const calculateAge = date => {
  const [day, month, year] = date.split('.');
  const enteredDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - enteredDate.getFullYear();
  const monthDiff = currentDate.getMonth() - enteredDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < enteredDate.getDate())) {
    age--;
  }

  return age;
};
