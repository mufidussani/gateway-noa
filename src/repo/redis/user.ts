import redis from "../../configs/redis";

interface UserData {
  id_user: string;
  token: string;
}

export async function setUserData(idUser: string, token: string) {
  try {
    let key = `SESSION:${idUser}`;
    const result = await redis.hset(key, "token", token);
    return { result: result, err: null };
  } catch (err) {
    return { result: null, err: err };
  }
}

export async function getUserData(idUser: string) {
  try {
    let key = `SESSION:${idUser}`;
    const userData = await redis.hget(key, "token");

    return userData;
  } catch (err) {
    return false;
  }
}

export async function setManpowerValidationSession(
  idManpower: string,
  nip: string,
  unixExpiredDate: number,
  otp: string
) {
  try {
    let key = `SESSION-MANPOWER:${idManpower}`;

    const result = await redis.hset(
      key,
      "id_manpower",
      idManpower,
      "nip",
      nip,
      "otp",
      otp,
      "expired_date",
      unixExpiredDate
    );
    return { result: result, err: null };
  } catch (err) {
    return { result: null, err: err };
  }
}

export async function getManpowerValidationSession(idManpower: string) {
  try {
    let key = `SESSION-MANPOWER:${idManpower}`;
    const manpowerData = await redis.hgetall(key);

    return manpowerData;
  } catch (err) {
    return false;
  }
}

export async function setSessionPWDManpower(
  idManpower: string,
  token: string,
  unixExpiredDate: number
) {
  try {
    let key = `SESSION-MANPOWER-PWD:${token}`;

    const result = await redis.hset(
      key,
      "id_manpower",
      idManpower,
      "token",
      token,
      "expired_date",
      unixExpiredDate
    );
    return { result: result, err: null };
  } catch (err) {
    return { result: null, err: err };
  }
}

export async function getSessionPWDManpower(token: string) {
  try {
    let key = `SESSION-MANPOWER-PWD:${token}`;
    const manpowerData = await redis.hgetall(key);

    return manpowerData;
  } catch (err) {
    return false;
  }
}

export async function setManpowerData(
  id: string,
  token: string,
  expired_date: number
) {
  try {
    let key = `SESSION-MANPOWER:${id}`;
    const result = await redis.hset(
      key,
      "token",
      token,
      "expired_date",
      expired_date
    );
    return { result: result, err: null };
  } catch (err) {
    return { result: null, err: err };
  }
}

export async function getManpowerData(id: string) {
  try {
    let key = `SESSION-MANPOWER:${id}`;
    const manpowerData = await redis.hgetall(key);

    return manpowerData;
  } catch (err) {
    return false;
  }
}

export async function setUserFeedBackData(
  id: string,
  token: string,
  expired_date: number
) {
  try {
    let key = `SESSION-FEEDBACK:${id}`;
    const result = await redis.hset(
      key,
      "token",
      token,
      "expired_date",
      expired_date
    );
    return { result: result, err: null };
  } catch (err) {
    return { result: null, err: err };
  }
}

export async function getUserFeedBackData(id: string) {
  try {
    let key = `SESSION-FEEDBACK:${id}`;
    const manpowerData = await redis.hgetall(key);

    return manpowerData;
  } catch (err) {
    return false;
  }
}

// export function getUserData(
//   idUser: string,
//   token: string
// ): Promise<UserData | null> {
//   return new Promise((resolve, reject) => {
//     const key = `user:${token}:${idUser}`;

//     Redis.red.hGetAll(key, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (data) {
//           resolve(data as UserData);
//         } else {
//           resolve(null);
//         }
//       }
//     });
//   });
// }
