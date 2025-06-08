
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [code, setCode] = useState('');
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        params: { code }
      });
      setProduct(res.data);
      setMessage('');
    } catch (err) {
      setProduct(null);
      setMessage('商品がマスタ未登録です');
    }
  };

  const handleAdd = () => {
    if (product) {
      setCart([...cart, product]);
      setProduct(null);
      setCode('');
      setMessage('');
    }
  };

  const handlePurchase = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/purchase`, {
        items: cart
      });
      setTotal(res.data.total_amount);
      setCart([]);
      setCode('');
      setProduct(null);
      setMessage('');
    } catch (err) {
      alert('購入に失敗しました');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>POS商品検索・購入</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="商品コードを入力"
          style={{ width: 200, marginRight: 10 }}
        />
        <button onClick={handleSearch}>商品コード読み込み</button>
      </div>

      {message && <div style={{ color: 'red', marginBottom: 10 }}>{message}</div>}

      {product && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ marginBottom: 5 }}>{product.NAME}</div>
          <div style={{ marginBottom: 5 }}>{product.PRICE}円</div>
          <button onClick={handleAdd}>追加</button>
        </div>
      )}

      {cart.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h3>購入リスト</h3>
          <ul style={{ paddingLeft: 20, listStyle: 'none' }}>
            {cart.map((item, idx) => (
              <li key={idx}>
                {item.NAME}　x1　{item.PRICE}円　{item.PRICE}円
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={handlePurchase}>購入</button>
      </div>

      {total !== null && (
        <div style={{ marginTop: 20, fontWeight: 'bold' }}>
          合計金額: ¥{total}
        </div>
      )}
    </div>
  );
}
