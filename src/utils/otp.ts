export function generateOTP(length: number): string {
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
}


export function leftTimeOTP(): number {
  const now = new Date();
  const unixTimestampNow = Math.floor(now.getTime() / 1000);
  const unixTimestampPlusOneMinute = unixTimestampNow + 60; // 60 detik dalam satu menit
  return unixTimestampPlusOneMinute;
}