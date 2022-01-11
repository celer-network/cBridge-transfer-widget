import alphas, {Alphas} from '../constants/alpha';

function alpha2Hex(alpha: Alphas) {
    return alphas[alpha];
}

function alpha2Hex20() {
    return alpha2Hex(20);
}

function alpha2Hex40() {
    return alpha2Hex(40);
}

export {
    alpha2Hex,
    alpha2Hex20,
    alpha2Hex40
}