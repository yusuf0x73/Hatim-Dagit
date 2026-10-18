//                                  BİSMİLLAHİRRAHMANİRRAHİM

import React from 'react';
import CuzlerHatimCard from 'components/cuz/CuzlerHatimCard';

// Hızlı hatim sayfasındaki kartın aynısı; bu sayfa silme işleminde ek parametre kullanmıyor
const StatsCard = props => <CuzlerHatimCard setYesHandlerStateParameters={() => {}} {...props} />;

export default StatsCard;
