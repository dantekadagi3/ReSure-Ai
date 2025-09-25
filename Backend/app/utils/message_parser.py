import extract_msg
import os
import pandas as pd
import PyPDF2
import pdfplumber
import re
from typing import Dict, List, Optional, Any, Tuple
import json
import numpy as np
from datetime import datetime, timedelta
import warnings
import mammoth
import io
import base64

warnings.filterwarnings('ignore')

class IntegratedReinsuranceProcessor:
    """
    Integrated system that combines MSG parsing with comprehensive reinsurance data extraction
    and decision making capabilities
    """
    
    def __init__(self, base_dir: str = None):
        """Initialize the integrated processor"""
        self.base_dir = base_dir or os.path.dirname(__file__)
        self.attachments_dir = os.path.join(self.base_dir, "attachments")
        self.structured_data_dir = os.path.join(self.base_dir, "structured_data")
        
        # Create necessary directories
        os.makedirs(self.attachments_dir, exist_ok=True)
        os.makedirs(self.structured_data_dir, exist_ok=True)
        
        # Currency exchange rates
        self.currency_rates = {
            'USD': 1.0, 'EUR': 1.08, 'GBP': 1.27, 'JPY': 0.0067,
            'CAD': 0.74, 'AUD': 0.65, 'KES': 0.0077, 'ZAR': 0.055
        }
        
        # Comprehensive field mappings for reinsurance data extraction
        self.field_mappings = {
            # Basic Information
            'cedant': [
                'cedant', 'ceding company', 'primary insurer', 'insurer', 
                'company name', 'cedent', 'ceding insurer'
            ],
            'broker': [
                'broker', 'intermediary', 'agent', 'placing broker',
                'reinsurance broker', 'intermediary company'
            ],
            'insured': [
                'insured', 'assured', 'policyholder', 'insured party',
                'client', 'insured company', 'insured name'
            ],
            
            # Geographic Information
            'geography': [
                'geography', 'location', 'territory', 'region', 'country',
                'state', 'province', 'geographic scope', 'territories covered'
            ],
            
            # Business Information
            'occupation': [
                'occupation', 'business type', 'industry', 'sector',
                'business activity', 'commercial activity', 'trade'
            ],
            'main_activities': [
                'main activities', 'principal activities', 'business activities',
                'operations', 'core business', 'primary business'
            ],
            
            # Coverage Information
            'perils_covered': [
                'perils covered', 'risks covered', 'coverage', 'perils',
                'insured perils', 'covered risks', 'scope of cover'
            ],
            'period_of_insurance': [
                'period of insurance', 'policy period', 'coverage period',
                'insurance period', 'term', 'duration'
            ],
            
            # Financial Information
            'sum_insured': [
                'sum insured', 'total sum insured', 'insured amount',
                'coverage amount', 'limit', 'insured value', 'tsi'
            ],
            'retention': [
                'retention', 'deductible', 'excess', 'self insured retention',
                'sir', 'cedant retention', 'first loss'
            ],
            'reinsurance_deduction': [
                'reinsurance deduction', 'reinsurance retention', 'net retention',
                'deduction', 'reinsurer deduction'
            ],
            'possible_maximum_loss': [
                'possible maximum loss', 'pml', 'maximum possible loss',
                'worst case scenario', 'maximum exposure', 'mpl'
            ],
            
            # Catastrophe Information
            'cat_exposure': [
                'catastrophe exposure', 'cat exposure', 'natural catastrophe',
                'natcat exposure', 'cat risk', 'catastrophe risk'
            ],
            
            # Claims Information
            'claims_experience': [
                'claims experience', 'loss history', 'claims history',
                'past claims', 'loss experience', 'claims record'
            ],
            'claim_ratio': [
                'claim ratio', 'loss ratio', 'claims ratio',
                'loss rate', 'claim frequency'
            ],
            
            # Premium Information
            'premium_rates': [
                'premium rate', 'rate', 'premium', 'pricing',
                'premium per mille', 'rate per cent', 'premium percentage'
            ],
            'share_offered': [
                'share offered', 'percentage offered', 'reinsurance share',
                'participation', 'quota share', 'share percentage'
            ],
            
            # Risk Assessment
            'climate_risk': [
                'climate change', 'climate risk', 'environmental risk',
                'climate factors', 'global warming impact'
            ],
            'esg_risk': [
                'esg', 'environmental social governance', 'sustainability',
                'esg factors', 'esg assessment'
            ],
            
            # Reports
            'surveyors_report': [
                'surveyors report', 'survey report', 'risk survey',
                'inspection report', 'engineering report'
            ]
        }
        
        # Decision criteria for acceptance/rejection
        self.decision_criteria = {
            'loss_ratio_thresholds': {
                'good': 0.6,      # Below 60% - Good risk
                'moderate': 0.8,   # 60-80% - Accept with modifications
                'high': 0.8        # Above 80% - High risk, careful underwriting
            },
            'risk_factors': {
                'geography_multiplier': {'CA': 1.2, 'FL': 1.3, 'TX': 1.1},
                'peril_multiplier': {'earthquake': 1.4, 'hurricane': 1.3, 'fire': 1.0},
                'business_multiplier': {'chemical': 1.5, 'energy': 1.3, 'retail': 0.9}
            }
        }

    def parse_msg_file(self, msg_path: str) -> Dict[str, Any]:
        """
        Parse .msg file and extract all data using integrated approach
        """
        print(f"📧 Processing MSG file: {os.path.basename(msg_path)}")
        
        # Load the .msg file
        msg = extract_msg.Message(msg_path)
        
        # Generate unique submission ID
        submission_id = self.generate_submission_id(msg)
        
        # Create submission-specific folder
        submission_dir = os.path.join(self.attachments_dir, submission_id)
        os.makedirs(submission_dir, exist_ok=True)
        
        # Extract basic email information
        email_data = {
            'submission_id': submission_id,
            'subject': msg.subject,
            'sender': msg.sender,
            'to': msg.to,
            'date': str(msg.date),
            'body': msg.body,
            'attachments': []
        }
        
        print(f"📋 Email Details:")
        print(f"   Subject: {email_data['subject']}")
        print(f"   From: {email_data['sender']}")
        print(f"   Date: {email_data['date']}")
        
        # Extract and save attachments
        if msg.attachments:
            print(f"\n📎 Found {len(msg.attachments)} attachments:")
            for i, att in enumerate(msg.attachments):
                try:
                    filename = att.longFilename or f"attachment_{i}"
                    print(f"   - {filename}")
                    
                    # Save attachment
                    att.save(customPath=submission_dir)
                    attachment_path = os.path.join(submission_dir, filename)
                    
                    # Store attachment info
                    email_data['attachments'].append({
                        'filename': filename,
                        'path': attachment_path,
                        'size': os.path.getsize(attachment_path) if os.path.exists(attachment_path) else 0,
                        'type': self.get_file_type(filename)
                    })
                    
                except Exception as e:
                    print(f"   ❌ Error saving attachment {i}: {e}")
        
        # Step 1: Extract structured data from email body using comprehensive approach
        print(f"\n🔍 Extracting comprehensive reinsurance data...")
        body_data = self.parse_submission_text(email_data['body'], 'email_body')
        
        # Step 2: Process attachments with comprehensive extraction
        print(f"\n📁 Processing attachments with comprehensive extraction...")
        attachment_data = self.process_attachments_comprehensive(email_data['attachments'])
        
        # Step 3: Combine and create comprehensive structured row
        print(f"\n📊 Creating comprehensive structured data...")
        structured_row = self.create_comprehensive_structured_row(email_data, body_data, attachment_data)
        
        # Step 4: Apply decision logic and risk analysis
        print(f"\n🤖 Applying underwriting decision logic...")
        structured_row = self.apply_decision_logic(structured_row)
        
        # Step 5: Save structured data
        self.save_structured_data(structured_row, submission_id)
        
        return {
            'email_data': email_data,
            'structured_data': structured_row,
            'submission_id': submission_id
        }

    def generate_submission_id(self, msg) -> str:
        """Generate unique submission ID from email"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Try to extract company/broker name from sender
        sender = str(msg.sender) if msg.sender else 'unknown'
        if '@' in sender:
            domain = sender.split('@')[1].split('.')[0]
            return f"FAC_{domain.upper()}_{timestamp}"
        else:
            return f"FAC_SUBMISSION_{timestamp}"

    def get_file_type(self, filename: str) -> str:
        """Determine file type from filename"""
        ext = os.path.splitext(filename)[1].lower()
        
        if ext in ['.xlsx', '.xls']:
            return 'excel'
        elif ext == '.csv':
            return 'csv'
        elif ext == '.pdf':
            return 'pdf'
        elif ext in ['.doc', '.docx']:
            return 'word'
        elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
            return 'image'
        else:
            return 'other'

    def parse_submission_text(self, text: str, source_file: str) -> Dict[str, Any]:
        """
        Parse text using comprehensive reinsurance field extraction
        """
        submission = {
            'source_file': source_file,
            'extraction_date': datetime.now().isoformat()
        }
        
        # Clean and prepare text for parsing
        text = text.lower().replace('\n', ' ').replace('\t', ' ')
        text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single
        
        print(f"   🔍 Searching for comprehensive fields in {len(text)} characters...")
        
        # Extract each field using comprehensive mappings
        for field_name, field_variants in self.field_mappings.items():
            value = self.extract_field_value(text, field_variants)
            submission[field_name] = value
            if value and value != 'Not Found':
                print(f"   ✅ Found {field_name}: {value[:50]}...")
        
        # Extract financial amounts (special handling)
        submission.update(self.extract_financial_data(text))
        
        # Extract claims history (special handling)
        submission.update(self.extract_claims_history(text))
        
        # Extract dates and periods
        submission.update(self.extract_dates_periods(text))
        
        return submission

    def extract_field_value(self, text: str, field_variants: List[str]) -> str:
        """Extract field value using multiple possible field names"""
        for variant in field_variants:
            # Try different patterns
            patterns = [
                rf'{variant}:?\s*([^\n\r;]+)',  # Field: Value
                rf'{variant}\s+is\s+([^\n\r;]+)',  # Field is Value
                rf'{variant}\s*[-–]\s*([^\n\r;]+)',  # Field - Value
                rf'{variant}\s*[:\-–]?\s*([A-Z][^\n\r;]+)',  # Field Value (capitalized)
            ]
            
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    # Clean up the extracted value
                    value = re.sub(r'\s+', ' ', value)
                    if len(value) > 3:  # Minimum meaningful length
                        return value
        
        return 'Not Found'

    def extract_financial_data(self, text: str) -> Dict[str, Any]:
        """Extract all financial amounts with currency handling"""
        financial_data = {}
        
        # Pattern to match currency amounts
        currency_pattern = r'([€£$¥]?[\d,]+\.?\d*)\s*([kmb]?)\s*(usd|eur|gbp|kes|million|billion|thousand)?'
        
        # Extract Sum Insured
        sum_insured_patterns = [
            r'sum insured:?\s*' + currency_pattern,
            r'total sum insured:?\s*' + currency_pattern,
            r'insured amount:?\s*' + currency_pattern,
            r'coverage amount:?\s*' + currency_pattern
        ]
        
        financial_data['sum_insured_amount'] = self.find_financial_amount(text, sum_insured_patterns)
        
        # Extract Premium
        premium_patterns = [
            r'premium:?\s*' + currency_pattern,
            r'annual premium:?\s*' + currency_pattern,
            r'premium rate:?\s*' + currency_pattern
        ]
        
        financial_data['premium_amount'] = self.find_financial_amount(text, premium_patterns)
        
        # Extract Retention/Deductible
        retention_patterns = [
            r'retention:?\s*' + currency_pattern,
            r'deductible:?\s*' + currency_pattern,
            r'excess:?\s*' + currency_pattern
        ]
        
        financial_data['retention_amount'] = self.find_financial_amount(text, retention_patterns)
        
        return financial_data

    def find_financial_amount(self, text: str, patterns: List[str]) -> str:
        """Find financial amount using multiple patterns"""
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        return 'Not Found'

    def extract_claims_history(self, text: str) -> Dict[str, Any]:
        """Extract claims history for the past 3-5 years"""
        claims_data = {}
        
        # Look for claims experience patterns
        claims_patterns = [
            r'claims experience.*?(\d+).*?years?',
            r'loss history.*?(\d+).*?years?',
            r'claims.*?last\s+(\d+)\s+years?',
            r'(\d+)\s+claims?.*?years?'
        ]
        
        # Extract claims ratios and percentages
        ratio_patterns = [
            r'claim ratio:?\s*([\d.]+)%?',
            r'loss ratio:?\s*([\d.]+)%?',
            r'claims ratio:?\s*([\d.]+)%?'
        ]
        
        # Find claims information
        for pattern in claims_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                claims_data['claims_years_covered'] = match.group(1)
                break
        
        for pattern in ratio_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                claims_data['historical_claim_ratio'] = float(match.group(1))
                break
        
        return claims_data

    def extract_dates_periods(self, text: str) -> Dict[str, Any]:
        """Extract insurance periods and dates"""
        date_data = {}
        
        # Date patterns
        date_patterns = [
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{4})',  # DD/MM/YYYY or MM/DD/YYYY
            r'(\d{4}-\d{2}-\d{2})',  # YYYY-MM-DD
            r'(\d{1,2}\s+\w+\s+\d{4})'  # DD Month YYYY
        ]
        
        # Period patterns
        period_patterns = [
            r'period:?\s*(\d+)\s*(month|year)s?',
            r'term:?\s*(\d+)\s*(month|year)s?',
            r'duration:?\s*(\d+)\s*(month|year)s?'
        ]
        
        # Extract dates
        dates_found = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dates_found.extend(matches)
        
        if dates_found:
            date_data['dates_mentioned'] = dates_found[:5]  # First 5 dates found
        
        # Extract period information
        for pattern in period_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_data['insurance_period'] = f"{match.group(1)} {match.group(2)}s"
                break
        
        return date_data

    def process_attachments_comprehensive(self, attachments: List[Dict]) -> Dict[str, Any]:
        """Process attachments with comprehensive reinsurance data extraction"""
        combined_data = {
            'excel_data': [],
            'pdf_data': [],
            'word_data': [],
            'loss_history': [],
            'financial_data': {},
            'additional_info': {}
        }
        
        for attachment in attachments:
            file_type = attachment['type']
            file_path = attachment['path']
            filename = attachment['filename']
            
            print(f"   📄 Processing {filename} ({file_type}) with comprehensive extraction...")
            
            try:
                if file_type == 'excel':
                    data = self.extract_from_excel(file_path)
                    combined_data['excel_data'].append(data)
                    
                elif file_type == 'csv':
                    data = self.extract_from_csv(file_path)
                    combined_data['excel_data'].append(data)
                    
                elif file_type == 'pdf':
                    # Extract text and apply comprehensive parsing
                    text = self.extract_from_pdf(file_path)
                    pdf_data = self.parse_submission_text(text, filename)
                    combined_data['pdf_data'].append(pdf_data)
                
                elif file_type == 'word':
                    # Extract text and apply comprehensive parsing
                    text = self.extract_from_docx(file_path)
                    word_data = self.parse_submission_text(text, filename)
                    combined_data['word_data'].append(word_data)
                
                # Look for specific data types
                if 'loss' in filename.lower() or 'claim' in filename.lower():
                    loss_data = self.extract_loss_history(file_path, file_type)
                    if loss_data:
                        combined_data['loss_history'].extend(loss_data)
                
                if 'financial' in filename.lower() or 'statement' in filename.lower():
                    financial_data = self.extract_financial_data_from_file(file_path, file_type)
                    combined_data['financial_data'].update(financial_data)
                        
            except Exception as e:
                print(f"   ❌ Error processing {filename}: {e}")
        
        return combined_data

    def extract_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        try:
            # Try pdfplumber first (better for structured PDFs)
            with pdfplumber.open(pdf_path) as pdf:
                text = ""
                for page_num, page in enumerate(pdf.pages[:10]):  # Limit to first 10 pages
                    page_text = page.extract_text()
                    if page_text:
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                        
            if text:
                return text
            else:
                # Fallback to PyPDF2
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    text = ""
                    for page in pdf_reader.pages[:10]:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                return text
                            
        except Exception as e:
            print(f"   ❌ Error extracting PDF: {e}")
            return ""

    def extract_from_docx(self, docx_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            with open(docx_path, "rb") as docx_file:
                result = mammoth.extract_raw_text(docx_file)
                return result.value
        except Exception as e:
            print(f"   ❌ DOCX extraction error: {e}")
            return ""

    def extract_from_excel(self, file_path: str) -> Dict[str, Any]:
        """Extract data from Excel files"""
        try:
            # Read all sheets
            excel_file = pd.ExcelFile(file_path)
            data = {'sheets': {}, 'summary': {}}
            
            for sheet_name in excel_file.sheet_names[:5]:  # Limit to first 5 sheets
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                data['sheets'][sheet_name] = df
                
                # Look for key financial metrics
                data['summary'].update(self.extract_from_dataframe(df, sheet_name))
            
            print(f"   ✅ Excel file processed: {len(data['sheets'])} sheets")
            return data
            
        except Exception as e:
            print(f"   ❌ Error reading Excel file: {e}")
            return {}

    def extract_from_csv(self, file_path: str) -> Dict[str, Any]:
        """Extract data from CSV files"""
        try:
            df = pd.read_csv(file_path)
            data = {'dataframe': df, 'summary': {}}
            data['summary'] = self.extract_from_dataframe(df, 'csv_data')
            
            print(f"   ✅ CSV file processed: {len(df)} rows")
            return data
            
        except Exception as e:
            print(f"   ❌ Error reading CSV file: {e}")
            return {}

    def extract_from_dataframe(self, df: pd.DataFrame, source_name: str) -> Dict[str, Any]:
        """Extract key information from pandas DataFrame"""
        summary = {}
        
        # Convert DataFrame to string for pattern matching
        df_str = df.to_string()
        
        # Look for monetary values in column headers
        for col in df.columns:
            col_lower = str(col).lower()
            
            if any(term in col_lower for term in ['sum insured', 'limit', 'tsi', 'coverage']):
                numeric_values = pd.to_numeric(df[col], errors='coerce').dropna()
                if not numeric_values.empty:
                    summary['sum_insured'] = numeric_values.iloc[0]
                    
            elif any(term in col_lower for term in ['premium', 'rate', 'cost']):
                numeric_values = pd.to_numeric(df[col], errors='coerce').dropna()
                if not numeric_values.empty:
                    summary['premium'] = numeric_values.iloc[0]
        
        # Look for loss/claim data
        if any(col.lower() in ['year', 'loss', 'claim', 'amount'] for col in df.columns):
            loss_data = self.extract_loss_history_from_dataframe(df)
            if loss_data:
                summary['loss_history'] = loss_data
        
        # Extract other fields using comprehensive text patterns
        text_extracted = self.parse_submission_text(df_str, source_name)
        summary.update(text_extracted)
        
        return summary

    def extract_loss_history(self, file_path: str, file_type: str) -> List[Dict]:
        """Extract loss history data from files"""
        loss_history = []
        
        try:
            if file_type == 'excel':
                excel_file = pd.ExcelFile(file_path)
                for sheet_name in excel_file.sheet_names:
                    df = pd.read_excel(file_path, sheet_name=sheet_name)
                    sheet_losses = self.extract_loss_history_from_dataframe(df)
                    if sheet_losses:
                        loss_history.extend(sheet_losses)
                        
            elif file_type == 'csv':
                df = pd.read_csv(file_path)
                csv_losses = self.extract_loss_history_from_dataframe(df)
                if csv_losses:
                    loss_history.extend(csv_losses)
                    
            elif file_type in ['pdf', 'word']:
                # Extract from document text
                if file_type == 'pdf':
                    text = self.extract_from_pdf(file_path)
                else:
                    text = self.extract_from_docx(file_path)
                
                # Look for year/amount patterns
                loss_patterns = [
                    r'(\d{4})[:\s-]+(?:Loss|Claim)[:\s]*\$?\s*([\d,]+(?:\.\d{2})?)',
                    r'(\d{4})[:\s-]+\$?\s*([\d,]+(?:\.\d{2})?)[:\s]*(?:Loss|Claim)'
                ]
                
                for pattern in loss_patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for match in matches:
                        try:
                            year, amount_str = match
                            amount = float(amount_str.replace(',', ''))
                            loss_history.append({
                                'year': int(year),
                                'amount': amount,
                                'source': f'{file_type}_extraction'
                            })
                        except (ValueError, TypeError):
                            continue
                            
        except Exception as e:
            print(f"   ❌ Error extracting loss history: {e}")
        
        return loss_history

    def extract_loss_history_from_dataframe(self, df: pd.DataFrame) -> List[Dict]:
        """Extract loss history from DataFrame"""
        losses = []
        
        # Look for year and loss/claim columns
        year_col = None
        loss_col = None
        
        for col in df.columns:
            col_lower = str(col).lower()
            if 'year' in col_lower:
                year_col = col
            elif any(term in col_lower for term in ['loss', 'claim', 'amount', 'paid']):
                loss_col = col
        
        if year_col is not None and loss_col is not None:
            for _, row in df.iterrows():
                try:
                    year = int(row[year_col])
                    amount = float(str(row[loss_col]).replace(',', '').replace('$', ''))
                    if 2000 <= year <= 2024:  # Reasonable year range
                        losses.append({
                            'year': year,
                            'amount': amount,
                            'source': 'dataframe'
                        })
                except (ValueError, TypeError):
                    continue
        
        return sorted(losses, key=lambda x: x['year'], reverse=True)

    def extract_financial_data_from_file(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Extract financial data from files"""
        financial_data = {}
        
        try:
            if file_type in ['excel', 'csv']:
                if file_type == 'excel':
                    df = pd.read_excel(file_path)
                else:
                    df = pd.read_csv(file_path)
                
                # Look for key financial metrics
                for col in df.columns:
                    col_lower = str(col).lower()
                    if 'revenue' in col_lower or 'income' in col_lower:
                        numeric_vals = pd.to_numeric(df[col], errors='coerce').dropna()
                        if not numeric_vals.empty:
                            financial_data['revenue'] = numeric_vals.iloc[0]
                    elif 'asset' in col_lower:
                        numeric_vals = pd.to_numeric(df[col], errors='coerce').dropna()
                        if not numeric_vals.empty:
                            financial_data['assets'] = numeric_vals.iloc[0]
                            
        except Exception as e:
            print(f"   ❌ Error extracting financial data: {e}")
        
        return financial_data

    def create_comprehensive_structured_row(self, email_data: Dict, body_data: Dict, attachment_data: Dict) -> Dict[str, Any]:
        """
        Create comprehensive structured data row with all reinsurance fields
        """
        # Initialize comprehensive structured row with all fields
        structured_row = {
            'SubmissionID': email_data['submission_id'],
            'EmailFrom': email_data['sender'],
            'EmailSubject': email_data['subject'],
            'EmailDate': email_data['date'],
            'AttachmentCount': len(email_data['attachments']),
            'ProcessedDate': datetime.now().isoformat(),
            
            # Core reinsurance fields from comprehensive mappings
            'Cedant': self.get_best_value('cedant', body_data, attachment_data),
            'Broker': self.get_best_value('broker', body_data, attachment_data),
            'Insured': self.get_best_value('insured', body_data, attachment_data),
            'Geography': self.get_best_value('geography', body_data, attachment_data),
            'Occupation': self.get_best_value('occupation', body_data, attachment_data),
            'MainActivities': self.get_best_value('main_activities', body_data, attachment_data),
            'PerilsCovered': self.get_best_value('perils_covered', body_data, attachment_data),
            'PeriodOfInsurance': self.get_best_value('period_of_insurance', body_data, attachment_data),
            'SumInsured': self.parse_monetary_value(self.get_best_value('sum_insured', body_data, attachment_data)),
            'Retention': self.parse_monetary_value(self.get_best_value('retention', body_data, attachment_data)),
            'ReinsuranceDeduction': self.parse_monetary_value(self.get_best_value('reinsurance_deduction', body_data, attachment_data)),
            'PossibleMaximumLoss': self.parse_monetary_value(self.get_best_value('possible_maximum_loss', body_data, attachment_data)),
            'CatExposure': self.get_best_value('cat_exposure', body_data, attachment_data),
            'ClaimsExperience': self.get_best_value('claims_experience', body_data, attachment_data),
            'ClaimRatio': self.parse_percentage(self.get_best_value('claim_ratio', body_data, attachment_data)),
            'PremiumRates': self.get_best_value('premium_rates', body_data, attachment_data),
            'ShareOffered': self.parse_percentage(self.get_best_value('share_offered', body_data, attachment_data)),
            'ClimateRisk': self.get_best_value('climate_risk', body_data, attachment_data),
            'ESGRisk': self.get_best_value('esg_risk', body_data, attachment_data),
            'SurveyorsReport': self.get_best_value('surveyors_report', body_data, attachment_data),
            
            # Financial data from attachments
            'SumInsuredUSD': self.convert_to_usd(self.get_financial_value('sum_insured', attachment_data)),
            'PremiumAmountUSD': self.convert_to_usd(self.get_financial_value('premium_amount', attachment_data)),
            'RetentionAmountUSD': self.convert_to_usd(self.get_financial_value('retention_amount', attachment_data)),
            
            # Loss history analysis
            'LossHistoryYears': self.get_loss_history_years(attachment_data),
            'AverageLossRatio': self.calculate_average_loss_ratio(attachment_data),
            'WorstLossYear': self.get_worst_loss_year(attachment_data),
            'LossHistoryTrend': self.analyze_loss_trend(attachment_data),
            
            # Risk assessment metrics
            'RiskScore': 0,  # Will be calculated in decision logic
            'GeographyRiskMultiplier': self.get_geography_risk(self.get_best_value('geography', body_data, attachment_data)),
            'PerilRiskMultiplier': self.get_peril_risk(self.get_best_value('perils_covered', body_data, attachment_data)),
            'BusinessRiskMultiplier': self.get_business_risk(self.get_best_value('occupation', body_data, attachment_data)),
            
            # Data quality indicators
            'DataCompleteness': self.calculate_data_completeness(body_data, attachment_data),
            'KeyFieldsPresent': self.count_key_fields_present(body_data, attachment_data),
            'AttachmentTypes': [att['type'] for att in email_data['attachments']],
            
            # Decision fields (populated by decision logic)
            'RecommendedAction': 'Pending Review',
            'UnderwriterNotes': '',
            'RiskRating': 'TBD',
            'PricingAdjustment': 0.0,
            'RequiredInformation': [],
            'DecisionReason': ''
        }
        
        return structured_row

    def get_best_value(self, field_name: str, body_data: Dict, attachment_data: Dict) -> str:
        """Get the best available value for a field from multiple sources"""
        # Priority order: PDF data, Excel data, Word data, Email body
        sources_to_check = [
            ('pdf_data', attachment_data.get('pdf_data', [])),
            ('excel_data', attachment_data.get('excel_data', [])),
            ('word_data', attachment_data.get('word_data', [])),
            ('body_data', [body_data])
        ]
        
        for source_name, source_list in sources_to_check:
            for data_dict in source_list if isinstance(source_list, list) else [source_list]:
                if isinstance(data_dict, dict):
                    value = data_dict.get(field_name, 'Not Found')
                    if value and value != 'Not Found' and len(str(value)) > 3:
                        return str(value)
                    
                    # Also check in summary data for Excel/CSV
                    if 'summary' in data_dict:
                        summary_value = data_dict['summary'].get(field_name, 'Not Found')
                        if summary_value and summary_value != 'Not Found':
                            return str(summary_value)
        
        return 'Not Found'

    def parse_monetary_value(self, value_str: str) -> float:
        """Parse monetary value from string"""
        if not value_str or value_str == 'Not Found':
            return 0.0
            
        # Remove common currency symbols and spaces
        cleaned = re.sub(r'[€£$¥,\s]', '', str(value_str))
        
        # Handle multipliers (K, M, B)
        multiplier = 1
        if cleaned.lower().endswith('k'):
            multiplier = 1000
            cleaned = cleaned[:-1]
        elif cleaned.lower().endswith('m'):
            multiplier = 1000000
            cleaned = cleaned[:-1]
        elif cleaned.lower().endswith('b'):
            multiplier = 1000000000
            cleaned = cleaned[:-1]
        
        try:
            return float(cleaned) * multiplier
        except (ValueError, TypeError):
            return 0.0

    def parse_percentage(self, value_str: str) -> float:
        """Parse percentage value from string"""
        if not value_str or value_str == 'Not Found':
            return 0.0
            
        # Extract numeric value
        match = re.search(r'([\d.]+)', str(value_str))
        if match:
            try:
                value = float(match.group(1))
                # If value is > 1, assume it's already a percentage
                return value if value > 1 else value * 100
            except (ValueError, TypeError):
                return 0.0
        return 0.0

    def get_financial_value(self, field_name: str, attachment_data: Dict) -> float:
        """Extract financial value from attachment data"""
        # Check financial_data section
        financial_data = attachment_data.get('financial_data', {})
        if field_name in financial_data:
            return self.parse_monetary_value(str(financial_data[field_name]))
        
        # Check excel and CSV summaries
        for excel_data in attachment_data.get('excel_data', []):
            if 'summary' in excel_data:
                if field_name in excel_data['summary']:
                    return self.parse_monetary_value(str(excel_data['summary'][field_name]))
        
        return 0.0

    def convert_to_usd(self, amount: float, currency: str = 'USD') -> float:
        """Convert amount to USD using exchange rates"""
        if amount == 0:
            return 0.0
        
        rate = self.currency_rates.get(currency.upper(), 1.0)
        return amount * rate

    def get_loss_history_years(self, attachment_data: Dict) -> int:
        """Get number of years of loss history available"""
        loss_history = attachment_data.get('loss_history', [])
        if not loss_history:
            return 0
        
        years = set()
        for loss in loss_history:
            if 'year' in loss:
                years.add(loss['year'])
        
        return len(years)

    def calculate_average_loss_ratio(self, attachment_data: Dict) -> float:
        """Calculate average loss ratio from loss history"""
        loss_history = attachment_data.get('loss_history', [])
        if not loss_history:
            return 0.0
        
        total_losses = sum(loss.get('amount', 0) for loss in loss_history)
        years = len(set(loss.get('year', 0) for loss in loss_history))
        
        if years > 0:
            return total_losses / years
        return 0.0

    def get_worst_loss_year(self, attachment_data: Dict) -> int:
        """Get the year with the highest loss"""
        loss_history = attachment_data.get('loss_history', [])
        if not loss_history:
            return 0
        
        worst_loss = max(loss_history, key=lambda x: x.get('amount', 0))
        return worst_loss.get('year', 0)

    def analyze_loss_trend(self, attachment_data: Dict) -> str:
        """Analyze loss trend over time"""
        loss_history = attachment_data.get('loss_history', [])
        if len(loss_history) < 3:
            return 'Insufficient Data'
        
        # Sort by year
        sorted_losses = sorted(loss_history, key=lambda x: x.get('year', 0))
        
        # Calculate trend over last 3 years
        recent_losses = sorted_losses[-3:]
        if len(recent_losses) >= 3:
            amounts = [loss.get('amount', 0) for loss in recent_losses]
            
            # Simple trend analysis
            if amounts[-1] > amounts[-2] > amounts[-3]:
                return 'Increasing'
            elif amounts[-1] < amounts[-2] < amounts[-3]:
                return 'Decreasing'
            elif max(amounts) - min(amounts) < sum(amounts) * 0.1:
                return 'Stable'
            else:
                return 'Volatile'
        
        return 'Unknown'

    def get_geography_risk(self, geography: str) -> float:
        """Get risk multiplier based on geography"""
        if not geography or geography == 'Not Found':
            return 1.0
        
        geography_lower = geography.lower()
        
        # High-risk areas
        if any(region in geography_lower for region in ['california', 'florida', 'japan', 'philippines']):
            return 1.3
        elif any(region in geography_lower for region in ['texas', 'louisiana', 'italy', 'turkey']):
            return 1.2
        elif any(region in geography_lower for region in ['midwest', 'canada', 'uk', 'germany']):
            return 1.0
        else:
            return 1.1  # Default for unknown regions

    def get_peril_risk(self, perils: str) -> float:
        """Get risk multiplier based on perils covered"""
        if not perils or perils == 'Not Found':
            return 1.0
        
        perils_lower = perils.lower()
        multiplier = 1.0
        
        # High-risk perils
        if 'earthquake' in perils_lower:
            multiplier *= 1.4
        if 'hurricane' in perils_lower or 'windstorm' in perils_lower:
            multiplier *= 1.3
        if 'flood' in perils_lower:
            multiplier *= 1.2
        if 'terrorism' in perils_lower:
            multiplier *= 1.3
        
        return min(multiplier, 2.0)  # Cap at 2.0

    def get_business_risk(self, occupation: str) -> float:
        """Get risk multiplier based on business type"""
        if not occupation or occupation == 'Not Found':
            return 1.0
        
        occupation_lower = occupation.lower()
        
        # High-risk businesses
        if any(term in occupation_lower for term in ['chemical', 'petrochemical', 'oil', 'gas']):
            return 1.5
        elif any(term in occupation_lower for term in ['manufacturing', 'mining', 'construction']):
            return 1.3
        elif any(term in occupation_lower for term in ['technology', 'software', 'office']):
            return 0.8
        elif any(term in occupation_lower for term in ['retail', 'wholesale', 'distribution']):
            return 0.9
        else:
            return 1.0

    def calculate_data_completeness(self, body_data: Dict, attachment_data: Dict) -> float:
        """Calculate data completeness percentage"""
        essential_fields = [
            'cedant', 'insured', 'geography', 'occupation', 'perils_covered',
            'sum_insured', 'period_of_insurance'
        ]
        
        found_fields = 0
        for field in essential_fields:
            value = self.get_best_value(field, body_data, attachment_data)
            if value and value != 'Not Found':
                found_fields += 1
        
        return (found_fields / len(essential_fields)) * 100

    def count_key_fields_present(self, body_data: Dict, attachment_data: Dict) -> int:
        """Count how many key fields are present"""
        key_fields = list(self.field_mappings.keys())
        count = 0
        
        for field in key_fields:
            value = self.get_best_value(field, body_data, attachment_data)
            if value and value != 'Not Found':
                count += 1
        
        return count

    def apply_decision_logic(self, structured_row: Dict[str, Any]) -> Dict[str, Any]:
        """Apply comprehensive underwriting decision logic"""
        print("   🔍 Analyzing risk factors...")
        
        # Calculate risk score
        risk_score = self.calculate_risk_score(structured_row)
        structured_row['RiskScore'] = risk_score
        
        # Determine risk rating
        if risk_score <= 3:
            risk_rating = 'Low Risk'
        elif risk_score <= 6:
            risk_rating = 'Moderate Risk'
        elif risk_score <= 8:
            risk_rating = 'High Risk'
        else:
            risk_rating = 'Very High Risk'
        
        structured_row['RiskRating'] = risk_rating
        
        # Apply decision logic
        decision_result = self.make_underwriting_decision(structured_row)
        structured_row.update(decision_result)
        
        print(f"   📊 Risk Score: {risk_score:.1f}/10")
        print(f"   🎯 Risk Rating: {risk_rating}")
        print(f"   💼 Decision: {structured_row['RecommendedAction']}")
        
        return structured_row

    def calculate_risk_score(self, row: Dict[str, Any]) -> float:
        """Calculate overall risk score (0-10 scale)"""
        score = 0.0
        
        # Geography risk (0-2 points)
        geo_multiplier = row.get('GeographyRiskMultiplier', 1.0)
        score += min((geo_multiplier - 0.8) * 4, 2.0)
        
        # Peril risk (0-2 points)
        peril_multiplier = row.get('PerilRiskMultiplier', 1.0)
        score += min((peril_multiplier - 0.8) * 2, 2.0)
        
        # Business risk (0-1.5 points)
        business_multiplier = row.get('BusinessRiskMultiplier', 1.0)
        score += min((business_multiplier - 0.8) * 3, 1.5)
        
        # Loss history risk (0-2 points)
        avg_loss_ratio = row.get('AverageLossRatio', 0)
        if avg_loss_ratio > 0:
            score += min(avg_loss_ratio / 50000000, 2.0)  # Assuming losses in dollars
        
        # Claims ratio risk (0-2 points)
        claim_ratio = row.get('ClaimRatio', 0)
        if claim_ratio > 60:
            score += min((claim_ratio - 60) / 20, 2.0)
        
        # Data completeness penalty (0-0.5 points)
        completeness = row.get('DataCompleteness', 100)
        if completeness < 70:
            score += (70 - completeness) / 40  # 0.5 points if 50% complete
        
        return min(score, 10.0)

    def make_underwriting_decision(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Make underwriting decision based on risk analysis"""
        risk_score = row.get('RiskScore', 0)
        data_completeness = row.get('DataCompleteness', 0)
        claim_ratio = row.get('ClaimRatio', 0)
        
        decision = {
            'RecommendedAction': 'Pending Review',
            'UnderwriterNotes': '',
            'PricingAdjustment': 0.0,
            'RequiredInformation': [],
            'DecisionReason': ''
        }
        
        # Check data completeness first
        if data_completeness < 50:
            decision.update({
                'RecommendedAction': 'Request More Information',
                'DecisionReason': 'Insufficient data for proper risk assessment',
                'RequiredInformation': self.get_missing_information(row)
            })
            return decision
        
        # Risk-based decisions
        if risk_score <= 3:
            decision.update({
                'RecommendedAction': 'Accept',
                'DecisionReason': 'Low risk profile with acceptable exposure',
                'PricingAdjustment': 0.0,
                'UnderwriterNotes': 'Standard terms acceptable'
            })
        elif risk_score <= 5:
            decision.update({
                'RecommendedAction': 'Accept with Conditions',
                'DecisionReason': 'Moderate risk - acceptable with pricing adjustment',
                'PricingAdjustment': 15.0,
                'UnderwriterNotes': 'Recommend 15% pricing increase'
            })
        elif risk_score <= 7:
            decision.update({
                'RecommendedAction': 'Refer to Senior Underwriter',
                'DecisionReason': 'High risk profile requires senior review',
                'PricingAdjustment': 25.0,
                'UnderwriterNotes': 'Consider 25% pricing increase and additional terms'
            })
        else:
            decision.update({
                'RecommendedAction': 'Decline',
                'DecisionReason': 'Risk profile exceeds acceptable thresholds',
                'UnderwriterNotes': 'Risk too high for standard acceptance'
            })
        
        # Special conditions based on specific factors
        if claim_ratio > 80:
            decision['UnderwriterNotes'] += ' | High claims history - consider exclusions'
        
        if row.get('LossHistoryTrend') == 'Increasing':
            decision['UnderwriterNotes'] += ' | Increasing loss trend - monitor closely'
        
        return decision

    def get_missing_information(self, row: Dict[str, Any]) -> List[str]:
        """Identify missing critical information"""
        missing = []
        critical_fields = {
            'Cedant': 'Ceding company information',
            'Insured': 'Insured party details',
            'Geography': 'Geographic scope',
            'PerilsCovered': 'Perils and coverage scope',
            'SumInsured': 'Sum insured amount',
            'PeriodOfInsurance': 'Insurance period'
        }
        
        for field, description in critical_fields.items():
            if not row.get(field) or row.get(field) == 'Not Found':
                missing.append(description)
        
        return missing

    def save_structured_data(self, structured_row: Dict[str, Any], submission_id: str):
        """Save structured data to file"""
        try:
            # Save as JSON
            json_path = os.path.join(self.structured_data_dir, f"{submission_id}.json")
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(structured_row, f, indent=2, ensure_ascii=False, default=str)
            
            # Save as CSV (append to master file)
            csv_path = os.path.join(self.structured_data_dir, "reinsurance_submissions.csv")
            df = pd.DataFrame([structured_row])
            
            # Append to existing CSV or create new one
            if os.path.exists(csv_path):
                df.to_csv(csv_path, mode='a', header=False, index=False)
            else:
                df.to_csv(csv_path, mode='w', header=True, index=False)
            
            print(f"   ✅ Structured data saved: {json_path}")
            
        except Exception as e:
            print(f"   ❌ Error saving structured data: {e}")

    def process_bulk_submissions(self, folder_path: str) -> Dict[str, Any]:
        print(f"\n🚀 Starting bulk processing from: {folder_path}")
        results = {
            'processed_count': 0,
            'failed_count': 0,
            'submissions': [],
            'summary_stats': {}
        }

        # Find all .msg files
        msg_files = []
        for file in os.listdir(folder_path):
            if file.lower().endswith('.msg'):
                msg_files.append(os.path.join(folder_path, file))
        
        print(f"📫 Found {len(msg_files)} MSG files to process")
        
        # Process each file
        for msg_file in msg_files:
            try:
                print(f"\n" + "="*80)
                result = self.parse_msg_file(msg_file)
                results['submissions'].append(result)
                results['processed_count'] += 1
                
            except Exception as e:
                print(f"❌ Failed to process {msg_file}: {e}")
                results['failed_count'] += 1
        
        # Generate summary statistics
        results['summary_stats'] = self.generate_summary_stats(results['submissions'])

        # Save bulk processing report
        self.save_bulk_report(results)

        # ✅ Auto-export to Excel
        structured_rows = [
            sub['structured_data']
            for sub in results['submissions']
            if 'structured_data' in sub
        ]
        if structured_rows:
            df = pd.DataFrame(structured_rows)
            output_path = os.path.join(self.structured_data_dir, "parsed_submissions.xlsx")
            df.to_excel(output_path, index=False, engine="openpyxl")
            print(f"📊 Excel export saved: {output_path}")

        print(f"\n✅ Bulk processing complete:")
        print(f"   Processed: {results['processed_count']} files")
        print(f"   Failed: {results['failed_count']} files")

        return results

    def generate_summary_stats(self, submissions: List[Dict]) -> Dict[str, Any]:
        """Generate summary statistics from processed submissions"""
        if not submissions:
            return {}
        
        stats = {
            'total_submissions': len(submissions),
            'decision_breakdown': {},
            'risk_rating_breakdown': {},
            'average_risk_score': 0,
            'data_completeness_average': 0,
            'common_geographies': {},
            'common_perils': {},
            'total_sum_insured_usd': 0
        }
        
        # Collect data for analysis
        decisions = []
        risk_ratings = []
        risk_scores = []
        completeness_scores = []
        geographies = []
        perils = []
        sum_insureds = []
        
        for submission in submissions:
            structured_data = submission.get('structured_data', {})
            
            if structured_data.get('RecommendedAction'):
                decisions.append(structured_data['RecommendedAction'])
            if structured_data.get('RiskRating'):
                risk_ratings.append(structured_data['RiskRating'])
            if structured_data.get('RiskScore'):
                risk_scores.append(structured_data['RiskScore'])
            if structured_data.get('DataCompleteness'):
                completeness_scores.append(structured_data['DataCompleteness'])
            if structured_data.get('Geography') and structured_data['Geography'] != 'Not Found':
                geographies.append(structured_data['Geography'])
            if structured_data.get('PerilsCovered') and structured_data['PerilsCovered'] != 'Not Found':
                perils.append(structured_data['PerilsCovered'])
            if structured_data.get('SumInsuredUSD'):
                sum_insureds.append(structured_data['SumInsuredUSD'])
        
        # Calculate statistics
        if decisions:
            stats['decision_breakdown'] = {decision: decisions.count(decision) for decision in set(decisions)}
        if risk_ratings:
            stats['risk_rating_breakdown'] = {rating: risk_ratings.count(rating) for rating in set(risk_ratings)}
        if risk_scores:
            stats['average_risk_score'] = sum(risk_scores) / len(risk_scores)
        if completeness_scores:
            stats['data_completeness_average'] = sum(completeness_scores) / len(completeness_scores)
        if sum_insureds:
            stats['total_sum_insured_usd'] = sum(sum_insureds)
        
        # Most common geographies and perils
        if geographies:
            stats['common_geographies'] = {geo: geographies.count(geo) for geo in set(geographies)}
        if perils:
            stats['common_perils'] = {peril: perils.count(peril) for peril in set(perils)}
        
        return stats

    @staticmethod
    def export_to_excel(results, output_path="parsed_submissions.xlsx"):
        if not results or "submissions" not in results:
            print("⚠ No results to export.")
            return

        structured_rows = []
        for submission in results["submissions"]:
            if "structured_data" in submission:
                structured_rows.append(submission["structured_data"])

        if not structured_rows:
            print("⚠ No structured data found.")
            return

        df = pd.DataFrame(structured_rows)
        df.to_excel(output_path, index=False, engine="openpyxl")
        print(f"✅ Results saved to {output_path}")

    def save_bulk_report(self, results: Dict[str, Any]):
        """Save bulk processing report"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            report_path = os.path.join(self.structured_data_dir, f"bulk_report_{timestamp}.json")
        
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False, default=str)
        
            print(f"📊 Bulk processing report saved: {report_path}")
        
        except Exception as e:
            print(f"❌ Error saving bulk report: {e}")


# Example usage and testing
if __name__ == "__main__":
    # Initialize processor
    processor = IntegratedReinsuranceProcessor()
    
    # Run bulk processing
    results = processor.process_bulk_submissions("messages/")
    
    # Export results to Excel
    IntegratedReinsuranceProcessor.export_to_excel(results, "parsed_submissions.xlsx")

    print("\n🎉 IntegratedReinsuranceProcessor is ready!")

