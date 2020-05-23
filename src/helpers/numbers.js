export default {
	formatNumbers(oldAmount) {
		let amount = oldAmount.toString().replace(/\$|\,/g, '');
		if (isNaN(amount)) amount = '0';
		// determinar su necesitamos signo
		let sign = '';
		if (amount < 0) sign = '-';
		if (sign && amount > -1000) return amount;
		// encontrar los centavos
		amount = Math.floor(amount * 100 + 0.501);
		let cents = amount % 100;
		amount = Math.floor(amount / 100).toString();
		if (cents < 10) cents = '0' + cents;
		for (var i = 0; i < Math.floor((amount.length - (1 + i)) / 3); i++) {
			amount =
				amount.substring(0, amount.length - (4 * i + 3)) +
				',' +
				amount.substring(amount.length - (4 * i + 3));
		}
		// devolver el numero con formato
		return amount;
	}
};
