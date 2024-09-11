import { SignJWT } from 'jose/jwt/sign';
import crypto from 'crypto';
import { TextEncoder } from 'util';

function generateHash() {
    const t = Math.floor(Date.now() / 1000);

    const randomValues = crypto.randomBytes(16);
    const r = parseInt(randomValues.toString('hex'), 16);

    const bpcValid = true;
    const jsonString = JSON.stringify({
        BPCValid: bpcValid,
        iat: t
    });
    const base64Encoded = Buffer.from(jsonString).toString('base64');

    const xi_BPCKey = "Jj:y9inO-mp_ue0Vwn|b9@x[h>h*%]i:";
    const bigIntR = BigInt(r).toString(32).replace(/\D/g, "");
    const bigIntT = BigInt(t);
    const hashInput = xi_BPCKey + (BigInt(bigIntR) + bigIntT).toString();
    const hash = crypto.createHash('sha3-512').update(hashInput).digest('hex');

    return `${base64Encoded}.${hash}.${BigInt(r)}`;
}


const createSignedJWT = async (t) => {
    const secretKey = new TextEncoder().encode("A?pfAt/,Kk<_&&(");

    const token = await new SignJWT(t)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30s')
        .sign(secretKey);

    return token;
}

const generatJWT = async () => {
    const ie = {
        "username": "username",
        "password": "password"
    };

    const jwt = await createSignedJWT(ie);

    return jwt;
}

(async () => {
    const jwt = await generatJWT();
    const hash = generateHash();

    console.log(jwt);
    console.log(hash);
})();