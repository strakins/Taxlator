import AsyncStorage from '@react-native-async-storage/async-storage';

export type TaxRecord = {
  id: string;
  type: 'PAYE' | 'CIT' | 'VAT';
  title: string;
  amount: number;
  date: string;
  details: any;
};

export const saveTaxRecord = async (record: TaxRecord) => {
  try {
    const existing = await AsyncStorage.getItem('tax_history');
    const history = existing ? JSON.parse(existing) : [];
    const newHistory = [record, ...history];
    await AsyncStorage.setItem('tax_history', JSON.stringify(newHistory));
    console.log("Record saved successfully!");
  } catch (e) {
    console.error("Failed to save record", e);
  }
};