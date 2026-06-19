/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { ResearchPaper } from '../types/research.types';

export const researchPapersData: ResearchPaper[] = [
  {
    id: 'cvd-prediction-adaBoost',
    title: 'A comprehensive machine learning approach for early detection of cardiovascular diseases using machine learning techniques',
    category: 'Cardiovascular',
    status: 'Completed',
    year: 2026,
    summary: 'A comprehensive machine learning framework for early cardiovascular disease prediction using the Framingham Heart Study dataset. The proposed AdaBoost-based model achieved 94.28% accuracy with 0.9783 ROC-AUC, demonstrating superior performance in clinical decision support.',
    description: `This research addresses the critical need for accurate early detection of cardiovascular diseases (CVDs), which remain the leading global cause of death with approximately 17.9 million annual fatalities. Using the Framingham Heart Study dataset (4,240 participants, 15 predictors), this study evaluates optimized machine learning techniques for CVD prediction.

Key methodological innovations include:
• Borderline-SMOTE2 for handling class imbalance (~15% positive cases)
• Complete-case analysis with feature standardization
• Systematic hyperparameter optimization for all classifiers
• Rigorous evaluation using multiple metrics (accuracy, ROC-AUC, sensitivity, specificity, F1-score, Cohen's Kappa)

Four optimized classifiers were evaluated: Random Forest, AdaBoost, Support Vector Machine (SVM), and Decision Tree. The ensemble-based approaches demonstrated superior stability, balanced classification, and better generalization for cardiovascular risk prediction.

Results demonstrate that AdaBoost achieved the highest performance with 94.28% accuracy, ROC-AUC of 0.9783, sensitivity of 0.9371, specificity of 0.9485, F1-score of 0.9424, and Cohen's Kappa of 0.8856. The proposed framework offers a reliable, interpretable, and clinically applicable decision-support solution for early CVD detection.`,
    accuracy: '94.28%',
    dataset: [
      'Framingham Heart Study Dataset (4,240 participants)',
      '15 clinical predictors',
      'Binary outcome (TenYearCHD: CVD event within 10 years)',
      'Demographics: age, sex, education',
      'Behavioral: smoking status, cigarettes per day',
      'Clinical: blood pressure, cholesterol, diabetes, BMI',
      'Laboratory: glucose levels'
    ],
    metrics: [
      { label: 'Accuracy', value: '94.28%' },
      { label: 'ROC-AUC', value: '0.9783' },
      { label: 'Sensitivity (Recall)', value: '93.71%' },
      { label: 'Specificity', value: '94.85%' },
      { label: 'F1-Score', value: '0.9424' },
      { label: "Cohen's Kappa", value: '0.8856' },
      { label: 'Precision', value: '94.77%' }
    ],
    technologies: [
      'AdaBoost',
      'Random Forest',
      'Support Vector Machine',
      'Decision Tree',
      'Borderline-SMOTE2',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn'
    ],
    links: [
      { label: 'Research Paper', url: 'https://www.itm-conferences.org/articles/itmconf/abs/2026/06/itmconf_iccret26_01018/itmconf_iccret26_01018.html' }
    ],
    notebookOutputs: [
      'Loading Framingham Heart Study dataset...',
      'Dataset shape: (4240, 16)',
      'Missing values detected and handled via complete-case analysis',
      'Class distribution: Positive (CVD): 15.2%, Negative: 84.8%',
      'Applying Borderline-SMOTE2 for imbalance correction...',
      'Synthetic samples generated: +1,284 minority samples',
      'Standardizing features using StandardScaler...',
      'Training AdaBoost classifier with hyperparameter tuning...',
      'Best parameters: n_estimators=300, learning_rate=0.1',
      'Model evaluation complete. Results:',
      '✓ Accuracy: 94.28%',
      '✓ ROC-AUC: 0.9783',
      '✓ Sensitivity: 93.71%',
      '✓ Specificity: 94.85%'
    ],
    authors: [
      'Sanjib Bayen¹',
      'Subhradeep Maji²',
      'Mafijur Mir³',
      'Sangeeta Panja⁴',
      'Payel Sengupta⁵',
      'Ranjan Banerjee⁶',
      'Avijit Kumar Chaudhuri⁷'
    ],
    journal: 'ITM Web Conf. Volume 86, 2026 (ICCRET-2026)',
    doi: 'https://doi.org/10.1051/itmconf/20268601018',
    bestModel: 'AdaBoost Classifier',
    pipelineStages: [
      'Data Imbalance Correction via Borderline-SMOTE2',
      'Feature Standardization and Complete-case Imputation',
      'Adaptive Boosting Ensemble Classifier Pipeline'
    ]
  }
];

export const cvdAdaBoostPaper: ResearchPaper = researchPapersData[0]!;

export const researchFolder: VFSNode = {
  name: 'research',
  type: 'folder',
  path: 'research',
  children: [
    {
      name: 'research.ipynb',
      type: 'file',
      path: 'research/research.ipynb',
      language: 'json',
      content: JSON.stringify({
        cells: researchPapersData.map(paper => ({
          cell_type: 'markdown',
          source: [`# ${paper.title}\n\n${paper.summary}\n\n**Authors:** ${paper.authors?.join(', ') || 'Sanjib Bayen'}\n\n**Year:** ${paper.year}\n\n**Status:** ${paper.status}`]
        }))
      }, null, 2)
    }
  ]
};

export default researchPapersData;
