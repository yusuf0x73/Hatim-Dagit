//                                     BİSMİLLAHİRRAHMANİRRAHİM

import Language from '../../../../strings/index';
import {DialogBox, DialogContainer, DialogIcon, DialogText, DialogTextSpan, DialogInputBox,
        DialogTextArea, FieldRow} from '../../Question/QuestionElements'
import close from '../../../../icons/close.svg';
import { Checkbox } from "@mantine/core";
import { useState, useContext } from "react";
import { useForm } from '@mantine/form';
import {DataServiceContext} from '../../../../backend'
import {PrimaryButton} from 'theme';
import LinkReadySheet from '../../LinkReadySheet';

const todayString = () => {
    const currentDate = new Date();
    return currentDate.getFullYear() + "-" + String(currentDate.getMonth()+1).padStart(2,'0') + "-" + String(currentDate.getDate()).padStart(2,'0');
}

// input type=number değeri string döner; veritabanına sayı olarak ve en az 1 kaydedilmeli
const toPositiveInt = (value, fallback) => {
    const number = parseInt(value, 10);
    return Number.isFinite(number) && number > 0 ? number : fallback;
}

const YearlyKhatmDialog = ({ visible, setVisible }) => {

        const dataService = useContext( DataServiceContext );
        const labels = Language["/"].Button.Header;

        // "form" -> bilgi girişi, "link" -> oluşturuldu penceresi
        const [step, setStep] = useState("form");
        const [link, setLink] = useState(null);
        const [error, setError] = useState(false);

        const form = useForm({
            initialValues: {
              header: '',
              description: '',
              startingDate: todayString(),
              howManyDays: 7,
              totalKhatmsBeDistributed: 30,
              donerli: false,
              makeNewHatim: false,
            }
          });

        const closeAll = () => {
            setVisible(false);
            setStep("form");
            setLink(null);
            setError(false);
        }

        const createKhatm = async () => {
            setStep("link");
            setLink(null);
            setError(false);

            try {
                const result = await dataService.yeniYillikHatim({
                    header: form.values.header,
                    description: form.values.description,
                    startingDate: form.values.startingDate || todayString(),
                    howManyDays: toPositiveInt(form.values.howManyDays, 7),
                    totalKhatmsBeDistributed: toPositiveInt(form.values.totalKhatmsBeDistributed, 30),
                    donerli: form.values.donerli,
                    makeNewHatim: form.values.makeNewHatim,
                    mevcutHatim: false
                });

                if(result.data !== undefined){
                    setLink(`https://hatimdagit.com/yillik/${result.data.hatimKey}`);
                }else{
                    setError(true);
                }
            } catch (e) {
                console.log(`YearlyKhatmDialog: ${e}`);
                setError(true);
            }
        }

        if(step === "link"){
            return <LinkReadySheet visible={visible} link={link} error={error}
                                   note={Language.Home.YearlyNote} onClose={closeAll} />
        }

        return (
            <DialogBox visibility={visible}>

                <DialogIcon src={close} alignEnd={true} onClick={closeAll} />

                <DialogContainer>

                    <DialogText fontSize={"20px"}>
                        {Language["/"].Button.YearBased}
                    </DialogText>

                    <FieldRow>
                        <DialogTextSpan>{labels.InputSpan[0]}</DialogTextSpan>
                        <DialogInputBox placeholder={labels.Input[0]} {...form.getInputProps('header')} />
                    </FieldRow>

                    <FieldRow>
                        <DialogTextSpan>{labels.InputSpan[1]}</DialogTextSpan>
                        <DialogTextArea rows="2" placeholder={labels.Input[1]} {...form.getInputProps('description')} />
                    </FieldRow>

                    <FieldRow>
                        <DialogTextSpan>{labels.InputSpan[5]}</DialogTextSpan>
                        <DialogInputBox type="date" {...form.getInputProps('startingDate')} />
                    </FieldRow>

                    <FieldRow>
                        <DialogTextSpan>{labels.InputSpan[6]}</DialogTextSpan>
                        <DialogInputBox type="number" inputMode="numeric" min="1" {...form.getInputProps('howManyDays')} />
                    </FieldRow>

                    <FieldRow>
                        <DialogTextSpan>{labels.InputSpan[7]}</DialogTextSpan>
                        <DialogInputBox type="number" inputMode="numeric" min="1" {...form.getInputProps('totalKhatmsBeDistributed')} />
                    </FieldRow>

                    <Checkbox size="md" styles={{ label: {fontSize: '0.95rem', lineHeight: 1.4}}}
                        checked={form.values.donerli}
                        onChange={(event) => form.setFieldValue('donerli', event.currentTarget.checked)}
                        label={labels.InputSpan[8]} />

                    <Checkbox size="md" styles={{ label: {fontSize: '0.95rem', lineHeight: 1.4}}}
                        checked={form.values.makeNewHatim}
                        onChange={(event) => form.setFieldValue('makeNewHatim', event.currentTarget.checked)}
                        label={labels.InputSpan[4]} />

                </DialogContainer>

                <PrimaryButton onClick={createKhatm}>{labels.Button}</PrimaryButton>

            </DialogBox>
        )
}

export default YearlyKhatmDialog;
