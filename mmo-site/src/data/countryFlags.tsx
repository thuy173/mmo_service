import usImg from '@/assets/flag/flag-us.svg';
import vnImg from '@/assets/flag/flag-vn.svg';
import gbImg from '@/assets/flag/flag-gb.svg';
import auImg from '@/assets/flag/flag-au.svg';
import deImg from '@/assets/flag/flag-de.svg';
import frImg from '@/assets/flag/flag-fr.svg';
import jpImg from '@/assets/flag/flag-jp.svg';
import krImg from '@/assets/flag/flag-kr.svg';

export const countryFlags: Record<string, JSX.Element> = {
    us: <img src={usImg} alt="us-flag" className="w-6" />,
    vn: <img src={vnImg} alt="vn-flag" className="w-6" />,
    gb: <img src={gbImg} alt="gb-flag" className="w-6" />,
    au: <img src={auImg} alt="au-flag" className="w-6" />,
    de: <img src={deImg} alt="de-flag" className="w-6" />,
    fr: <img src={frImg} alt="fr-flag" className="w-6" />,
    jp: <img src={jpImg} alt="jp-flag" className="w-6" />,
    kr: <img src={krImg} alt="kr-flag" className="w-6" />,
};
