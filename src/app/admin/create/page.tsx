/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/create/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Region, Section } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function CreatePage() {
  const { t, language } = useLanguage();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createType, setCreateType] = useState<'region' | 'section' | 'control'>('region');
  
  const [itemNameBG, setItemNameBG] = useState('');
  const [itemNameEN, setItemNameEN] = useState('');

  const [regions, setRegions] = useState<Region[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Извличане на данните
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [regionsRes, sectionsRes] = await Promise.all([
        // КОРЕКЦИЯ: Искаме ВСИЧКИ колони, за да отговарят на типа 'Region'
        supabase.from('regions').select('*').order('name_bg'),
        // КОРЕКЦИЯ: Искаме ВСИЧКИ колони, за да отговарят на типа 'Section'
        supabase.from('sections').select('*').order('name_bg')
      ]);
      setRegions(regionsRes.data || []);
      setSections(sectionsRes.data || []);
      setIsLoading(false);
    };
    fetchData();
  }, [supabase]);

  // Нулиране при смяна на типа
  useEffect(() => {
    setItemNameBG('');
    setItemNameEN('');
    setSelectedRegion('');
    setSelectedSection('');
  }, [createType]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!itemNameBG || !itemNameEN) {
        toast.error(t.nameRequiredError);
        return;
    }
    setIsSubmitting(true);

    try {
        let error;
        const dataToInsert = { name_bg: itemNameBG, name_en: itemNameEN };

        if (createType === 'region') {
            const { error: reqError } = await supabase.from('regions').insert([dataToInsert]);
            error = reqError;
        } else if (createType === 'section') {
            if (!selectedRegion) { toast.error(t.selectionRequiredError); setIsSubmitting(false); return; }
            const { error: reqError } = await supabase.from('sections').insert([{ ...dataToInsert, region_id: selectedRegion }]);
            error = reqError;
        } else if (createType === 'control') {
            if (!selectedSection) { toast.error(t.selectionRequiredError); setIsSubmitting(false); return; }
            const { error: reqError } = await supabase.from('controls').insert([{ ...dataToInsert, section_id: selectedSection }]);
            error = reqError;
        }

        if (error) throw error;

        toast.success(t.createSuccess);
        setItemNameBG('');
        setItemNameEN('');
        // Презареждаме данните, за да се появят в падащите списъци
        const { data: newRegions } = await supabase.from('regions').select('*').order('name_bg');
        const { data: newSections } = await supabase.from('sections').select('*').order('name_bg');
        setRegions(newRegions || []);
        setSections(newSections || []);

    } catch (e: any) {
        toast.error(`${t.createError}: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="animate-spin h-8 w-8 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{t.createTitle}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t.createSubtitle}</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
        <form onSubmit={handleCreate} className="space-y-6 p-6">
          <div>
            <label htmlFor="createType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.createChooseType}
            </label>
            <select 
              id="createType" 
              onChange={(e) => setCreateType(e.target.value as any)} 
              value={createType} 
              className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="region">{t.region}</option>
              <option value="section">{t.section}</option>
              <option value="control">{t.control}</option>
            </select>
          </div>

          {createType === 'section' && (
            <div>
              <label htmlFor="sectionRegion" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.createSelectRegion}</label>
              <select id="sectionRegion" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" required>
                <option value="" disabled>{t.createSelectPlaceholder}</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>
                    {language === 'en' ? r.name_en || r.name_bg : r.name_bg}
                  </option>
                ))}
              </select>
            </div>
          )}

          {createType === 'control' && (
            <div>
              <label htmlFor="controlSection" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.createSelectSection}</label>
              <select id="controlSection" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" required>
                  <option value="" disabled>{t.createSelectPlaceholder}</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {language === 'en' ? s.name_en || s.name_bg : s.name_bg}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="itemNameBG" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.nameBG}</label>
              <input 
                id="itemNameBG" 
                type="text" 
                value={itemNameBG} 
                onChange={(e) => setItemNameBG(e.target.value)} 
                placeholder={`${t.createItemNamePlaceholder} ${t[createType]}...`}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" 
                required
              />
            </div>
            <div>
              <label htmlFor="itemNameEN" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.nameEN}</label>
              <input 
                id="itemNameEN" 
                type="text" 
                value={itemNameEN} 
                onChange={(e) => setItemNameEN(e.target.value)} 
                placeholder={`Enter name for ${t[createType]}...`}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm dark:bg-slate-700 focus:border-indigo-500 focus:ring-indigo-500" 
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isSubmitting ? t.creatingButton : `${t.createButton} ${t[createType]}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}