import Block from "./Block";
import "./scss/index.scss";
import React from "react";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState<string>("USD");
  const [toCurrency, setToCurrency] = React.useState<string>("UAH");
  const [fromPrice, setFromPrice] = React.useState<number>(1);
  const [toPrice, setToPrice] = React.useState<number>(0);

  const ratesRef = React.useRef<{ [key: string]: number }>({});

  React.useEffect(() => {
    fetch("https://www.cbr-xml-daily.ru/latest.js")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json.rates;
        onChangeFromPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить информацию");
      });
  }, []);

  const onChangeFromPrice = (value: number) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];

    setToPrice(Number(result.toFixed(3)));
    setFromPrice(value);
  };
  const onChangeToPrice = (value: number) => {
    const result =
      (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;

    setFromPrice(Number(result.toFixed(3)));
    setToPrice(value);
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);
  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeValue={onChangeFromPrice}
        onChangeCurrency={setFromCurrency}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeValue={onChangeToPrice}
        onChangeCurrency={setToCurrency}
      />
    </div>
  );
}

export default App;
