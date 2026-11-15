import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`[Server]: HTTP-сервер успішно запущено на http://localhost:${PORT}`);
  console.log(`[Health]: Перевірка стану доступна за адресою http://localhost:${PORT}/api/v1/health`);
});