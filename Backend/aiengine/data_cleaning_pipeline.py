import pandas as pd
import numpy as np
import re
import json
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class EnhancedDataCleaningPipeline:
    """
    Enhanced data cleaning and transformation pipeline for facultative reinsurance submissions
    with current exchange rates and improved error handling
    """
    
    def __init__(self):
        """Initialize the enhanced cleaning pipeline with updated mappings and configurations"""
        
        # Updated currency conversion rates to USD (September 2025 - current rates)
        self.currency_rates = {
            'USD': 1.0,
            'EUR': 1.1739,    # Updated based on current EUR/USD rate
            'GBP': 1.3245,    # British Pound
            'KES': 0.0077,    # Kenyan Shilling  
            'CAD': 0.7425,    # Canadian Dollar
            'AUD': 0.6789,    # Australian Dollar
            'JPY': 0.00687,   # Japanese Yen (per JPY)
            'CHF': 1.1234,    # Swiss Franc
            'ZAR': 0.0554,    # South African Rand
            'NGN': 0.00062,   # Nigerian Naira
            'INR': 0.01199,   # Indian Rupee
            'SGD': 0.7653,    # Singapore Dollar
            'HKD': 0.1282,    # Hong Kong Dollar
            'CNY': 0.1405,    # Chinese Yuan
        }
        
        # Enhanced geography standardization mapping
        self.geography_mappings = {
            # US States - full names to abbreviations
            'california': 'CA', 'texas': 'TX', 'florida': 'FL', 'new york': 'NY',
            'illinois': 'IL', 'pennsylvania': 'PA', 'ohio': 'OH', 'georgia': 'GA',
            'north carolina': 'NC', 'michigan': 'MI', 'new jersey': 'NJ',
            'virginia': 'VA', 'washington': 'WA', 'arizona': 'AZ', 'massachusetts': 'MA',
            'tennessee': 'TN', 'indiana': 'IN', 'missouri': 'MO', 'maryland': 'MD',
            'wisconsin': 'WI', 'colorado': 'CO', 'minnesota': 'MN', 'south carolina': 'SC',
            'alabama': 'AL', 'louisiana': 'LA', 'kentucky': 'KY', 'oregon': 'OR',
            'oklahoma': 'OK', 'connecticut': 'CT', 'utah': 'UT', 'iowa': 'IA',
            'nevada': 'NV', 'arkansas': 'AR', 'mississippi': 'MS', 'kansas': 'KS',
            'new mexico': 'NM', 'nebraska': 'NE', 'west virginia': 'WV',
            'idaho': 'ID', 'hawaii': 'HI', 'new hampshire': 'NH', 'maine': 'ME',
            'montana': 'MT', 'rhode island': 'RI', 'delaware': 'DE', 'south dakota': 'SD',
            'north dakota': 'ND', 'alaska': 'AK', 'vermont': 'VT', 'wyoming': 'WY',
            
            # International locations
            'united kingdom': 'UK', 'great britain': 'UK', 'england': 'UK',
            'scotland': 'UK', 'wales': 'UK', 'northern ireland': 'UK',
            'canada': 'CA', 'mexico': 'MX', 'germany': 'DE', 'france': 'FR',
            'italy': 'IT', 'spain': 'ES', 'netherlands': 'NL', 'belgium': 'BE',
            'switzerland': 'CH', 'austria': 'AT', 'sweden': 'SE', 'norway': 'NO',
            'denmark': 'DK', 'finland': 'FI', 'australia': 'AU', 'japan': 'JP',
            'south korea': 'KR', 'china': 'CN', 'singapore': 'SG', 'hong kong': 'HK',
            'india': 'IN', 'brazil': 'BR', 'argentina': 'AR', 'chile': 'CL',
            'south africa': 'ZA', 'kenya': 'KE', 'nigeria': 'NG', 'ghana': 'GH',
            'egypt': 'EG', 'morocco': 'MA', 'thailand': 'TH', 'malaysia': 'MY',
            'indonesia': 'ID', 'philippines': 'PH', 'vietnam': 'VN', 'taiwan': 'TW',
        }
        
        # Enhanced peril standardization mapping
        self.peril_mappings = {
            # Fire related
            'fire risk': 'Fire', 'fire': 'Fire', 'fire & explosion': 'Fire',
            'fire/explosion': 'Fire', 'fire and explosion': 'Fire',
            'combustion': 'Fire', 'ignition': 'Fire', 'conflagration': 'Fire',
            
            # Natural catastrophes
            'earthquake': 'Earthquake', 'eq': 'Earthquake', 'seismic': 'Earthquake',
            'tremor': 'Earthquake', 'quake': 'Earthquake',
            'hurricane': 'Hurricane', 'typhoon': 'Hurricane', 'cyclone': 'Hurricane',
            'tropical storm': 'Hurricane', 'tropical cyclone': 'Hurricane',
            'windstorm': 'Windstorm', 'wind': 'Windstorm', 'tornado': 'Tornado',
            'twister': 'Tornado', 'severe weather': 'Windstorm',
            'flood': 'Flood', 'flooding': 'Flood', 'inundation': 'Flood',
            'flash flood': 'Flood', 'river flood': 'Flood',
            'tsunami': 'Tsunami', 'tidal wave': 'Tsunami',
            'hail': 'Hail', 'hailstorm': 'Hail', 'hailstone': 'Hail',
            'lightning': 'Lightning', 'lightning strike': 'Lightning',
            'wildfire': 'Wildfire', 'forest fire': 'Wildfire', 'bush fire': 'Wildfire',
            'brushfire': 'Wildfire', 'grassfire': 'Wildfire',
            
            # Property perils
            'property': 'Property', 'property damage': 'Property',
            'all risks': 'All Risks', 'all risk': 'All Risks',
            'named perils': 'Named Perils', 'specified perils': 'Named Perils',
            'theft': 'Theft', 'burglary': 'Theft', 'robbery': 'Theft',
            'vandalism': 'Vandalism', 'malicious damage': 'Vandalism',
            'water damage': 'Water Damage', 'pipe burst': 'Water Damage',
            
            # Liability
            'liability': 'Liability', 'third party liability': 'Liability',
            'public liability': 'Public Liability', 'product liability': 'Product Liability',
            'professional liability': 'Professional Liability',
            'errors and omissions': 'Professional Liability', 'e&o': 'Professional Liability',
            'directors and officers': 'D&O', 'd&o': 'D&O',
            'employment practices': 'EPLI', 'epli': 'EPLI',
            
            # Marine
            'marine': 'Marine', 'cargo': 'Marine Cargo', 'hull': 'Marine Hull',
            'marine cargo': 'Marine Cargo', 'marine hull': 'Marine Hull',
            'vessel': 'Marine Hull', 'ship': 'Marine Hull',
            
            # Aviation
            'aviation': 'Aviation', 'aircraft': 'Aviation', 'aviation hull': 'Aviation Hull',
            'aviation liability': 'Aviation Liability', 'airline': 'Aviation',
            
            # Energy
            'energy': 'Energy', 'oil & gas': 'Energy', 'petroleum': 'Energy',
            'offshore': 'Energy', 'onshore': 'Energy', 'pipeline': 'Energy',
            'refinery': 'Energy', 'drilling': 'Energy',
            
            # Specialty
            'terrorism': 'Terrorism', 'political risk': 'Political Risk',
            'cyber': 'Cyber', 'cyber liability': 'Cyber', 'cyber attack': 'Cyber',
            'data breach': 'Cyber', 'privacy': 'Cyber',
            'environmental': 'Environmental', 'pollution': 'Environmental',
            'contamination': 'Environmental', 'environmental liability': 'Environmental',
        }
        
        # Enhanced business type standardization
        self.business_type_mappings = {
            'chemical': 'Chemical', 'petrochemical': 'Chemical', 'pharmaceutical': 'Chemical',
            'chemical plant': 'Chemical', 'chemical processing': 'Chemical',
            'manufacturing': 'Manufacturing', 'factory': 'Manufacturing', 'production': 'Manufacturing',
            'automotive': 'Manufacturing', 'electronics': 'Manufacturing',
            'energy': 'Energy', 'power': 'Energy', 'utility': 'Energy', 'power plant': 'Energy',
            'renewable energy': 'Energy', 'solar': 'Energy', 'wind farm': 'Energy',
            'oil_gas': 'Oil & Gas', 'oil and gas': 'Oil & Gas', 'petroleum': 'Oil & Gas',
            'upstream': 'Oil & Gas', 'downstream': 'Oil & Gas', 'midstream': 'Oil & Gas',
            'transportation': 'Transportation', 'logistics': 'Transportation', 'shipping': 'Transportation',
            'trucking': 'Transportation', 'rail': 'Transportation', 'courier': 'Transportation',
            'real_estate': 'Real Estate', 'property': 'Real Estate', 'commercial': 'Real Estate',
            'residential': 'Real Estate', 'office building': 'Real Estate',
            'healthcare': 'Healthcare', 'hospital': 'Healthcare', 'medical': 'Healthcare',
            'clinic': 'Healthcare', 'pharmaceutical': 'Healthcare',
            'technology': 'Technology', 'tech': 'Technology', 'software': 'Technology',
            'it services': 'Technology', 'data center': 'Technology', 'cloud': 'Technology',
            'retail': 'Retail', 'consumer': 'Retail', 'shopping center': 'Retail',
            'restaurant': 'Retail', 'hospitality': 'Hospitality', 'hotel': 'Hospitality',
            'financial': 'Financial Services', 'banking': 'Financial Services',
            'insurance': 'Financial Services', 'investment': 'Financial Services',
            'agriculture': 'Agriculture', 'farming': 'Agriculture', 'agribusiness': 'Agriculture',
            'food processing': 'Agriculture', 'livestock': 'Agriculture',
            'mining': 'Mining', 'extraction': 'Mining', 'coal': 'Mining', 'metals': 'Mining',
            'construction': 'Construction', 'building': 'Construction', 'infrastructure': 'Construction',
            'aviation': 'Aviation', 'airline': 'Aviation', 'airport': 'Aviation',
            'marine': 'Marine', 'maritime': 'Marine', 'port': 'Marine', 'shipyard': 'Marine',
        }
        
        # Risk multipliers for advanced risk scoring
        self.risk_multipliers = {
            'geography_risk': {
                # Very High Risk (Natural catastrophes)
                'CA': 9.0, 'FL': 9.5, 'TX': 8.5, 'LA': 9.0, 'HI': 8.0,
                'AK': 7.5, 'WA': 7.0, 'OR': 7.0, 'NV': 6.5, 'AZ': 6.5,
                # International high-risk
                'JP': 9.0, 'PH': 9.5, 'ID': 8.5, 'CL': 8.0, 'TW': 8.5,
                # Moderate risk
                'NY': 6.0, 'NJ': 6.0, 'CT': 6.0, 'MA': 5.5, 'SC': 7.5,
                'NC': 7.0, 'GA': 7.0, 'AL': 7.5, 'MS': 8.0, 'TN': 6.0,
                # Lower risk (default for others)
                'DEFAULT': 5.0
            },
            'peril_risk': {
                'Earthquake': 1.5, 'Hurricane': 1.4, 'Flood': 1.3, 'Tsunami': 1.6,
                'Tornado': 1.3, 'Wildfire': 1.2, 'Terrorism': 1.4, 'Cyber': 1.3,
                'Fire': 1.1, 'Lightning': 1.0, 'Theft': 0.9, 'Property': 1.0,
                'Liability': 1.1, 'Professional Liability': 1.2, 'D&O': 1.2,
                'DEFAULT': 1.0
            },
            'business_risk': {
                'Chemical': 1.6, 'Oil & Gas': 1.5, 'Energy': 1.4, 'Mining': 1.4,
                'Aviation': 1.3, 'Marine': 1.2, 'Manufacturing': 1.1,
                'Transportation': 1.2, 'Construction': 1.3, 'Healthcare': 0.9,
                'Technology': 0.7, 'Financial Services': 0.6, 'Real Estate': 0.8,
                'Retail': 0.7, 'Agriculture': 0.9, 'DEFAULT': 1.0
            }
        }
    
    def clean_and_transform_data(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """
        Main function to clean and transform the structured data
        
        Args:
            df: DataFrame with structured submission data
            verbose: Whether to print detailed progress information
            
        Returns:
            Cleaned and transformed DataFrame
        """
        if verbose:
            print("🧹 STARTING ENHANCED DATA CLEANING & TRANSFORMATION")
            print("=" * 60)
        
        # Create a copy to avoid modifying original
        cleaned_df = df.copy()
        
        if verbose:
            print(f"📊 Input data shape: {cleaned_df.shape}")
            print(f"📋 Columns: {list(cleaned_df.columns)}")
        
        # Data cleaning steps
        try:
            # Step 1: Clean and convert currency values
            if verbose: print("\n💰 Step 1: Converting currency values to USD...")
            cleaned_df = self.convert_currency_values(cleaned_df, verbose)
            
            # Step 2: Normalize geography
            if verbose: print("\n🌍 Step 2: Normalizing geography data...")
            cleaned_df = self.normalize_geography(cleaned_df, verbose)
            
            # Step 3: Standardize perils
            if verbose: print("\n⚡ Step 3: Standardizing peril types...")
            cleaned_df = self.standardize_perils(cleaned_df, verbose)
            
            # Step 4: Normalize business types
            if verbose: print("\n🏢 Step 4: Normalizing business types...")
            cleaned_df = self.normalize_business_types(cleaned_df, verbose)
            
            # Step 5: Handle missing values intelligently
            if verbose: print("\n🔧 Step 5: Handling missing values...")
            cleaned_df = self.handle_missing_values(cleaned_df, verbose)
            
            # Step 6: Create engineered features
            if verbose: print("\n🔬 Step 6: Creating engineered features...")
            cleaned_df = self.create_features(cleaned_df, verbose)
            
            # Step 7: Advanced risk scoring
            if verbose: print("\n🎯 Step 7: Computing advanced risk scores...")
            cleaned_df = self.compute_risk_scores(cleaned_df, verbose)
            
            # Step 8: Data validation and quality checks
            if verbose: print("\n✅ Step 8: Validating cleaned data...")
            cleaned_df = self.validate_data(cleaned_df, verbose)
            
            if verbose:
                print(f"\n📊 Output data shape: {cleaned_df.shape}")
                print("🎉 DATA CLEANING COMPLETE!")
                print("=" * 60)
            
            return cleaned_df
            
        except Exception as e:
            if verbose:
                print(f"❌ Error during data cleaning: {e}")
            raise
    
    def convert_currency_values(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Convert all currency values to USD numeric format with improved error handling"""
        
        # Auto-detect currency columns
        currency_columns = []
        for col in df.columns:
            if any(keyword in col.lower() for keyword in ['sum', 'premium', 'amount', 'value', 'limit']):
                currency_columns.append(col)
        
        # Common currency column names
        standard_currency_cols = ['SumInsured', 'PastPremium', 'Retention', 'Deductible', 'Limit']
        currency_columns.extend([col for col in standard_currency_cols if col in df.columns])
        
        # Remove duplicates
        currency_columns = list(set(currency_columns))
        
        for col in currency_columns:
            if verbose:
                print(f"   💵 Converting {col} to USD...")
            
            try:
                # Convert to string first
                df[col] = df[col].astype(str)
                
                # Apply currency conversion with error tracking
                conversion_results = []
                errors = 0
                
                for idx, value in df[col].items():
                    try:
                        converted = self.parse_currency_to_usd(value)
                        conversion_results.append(converted)
                    except Exception as e:
                        conversion_results.append(0.0)
                        errors += 1
                
                df[col] = conversion_results
                
                # Convert to numeric
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                
                if verbose:
                    total_value = df[col].sum()
                    non_zero_count = (df[col] > 0).sum()
                    print(f"   ✅ {col}: Total value ${total_value:,.0f} USD ({non_zero_count} non-zero values)")
                    if errors > 0:
                        print(f"   ⚠️  {errors} conversion errors in {col}")
                        
            except Exception as e:
                if verbose:
                    print(f"   ❌ Error converting {col}: {e}")
                df[col] = 0.0  # Set to zero if conversion fails
        
        return df
    
    def parse_currency_to_usd(self, value_str: str) -> float:
        """Enhanced currency parsing with better error handling"""
        if pd.isna(value_str) or str(value_str).lower() in ['nan', 'none', '', '0', 'not found']:
            return 0.0
        
        try:
            value_str = str(value_str).strip().upper()
            
            # Handle "Not Found" and similar
            if any(phrase in value_str.lower() for phrase in ['not found', 'unknown', 'n/a', 'nil']):
                return 0.0
            
            # Extract currency code
            currency_code = self.extract_currency_code(value_str)
            
            # Extract numeric value with multiplier
            numeric_value = self.extract_numeric_value(value_str)
            
            # Convert to USD
            exchange_rate = self.currency_rates.get(currency_code, 1.0)
            usd_value = numeric_value * exchange_rate
            
            return max(0.0, usd_value)  # Ensure non-negative
            
        except Exception as e:
            return 0.0
    
    def extract_currency_code(self, value_str: str) -> str:
        """Enhanced currency code extraction"""
        
        # Look for explicit currency codes first
        for currency in self.currency_rates.keys():
            if currency in value_str:
                return currency
        
        # Look for currency symbols
        if '$' in value_str:
            # Check for specific dollar types
            if any(indicator in value_str for indicator in ['CAD', 'AUD', 'SGD', 'HKD']):
                for curr in ['CAD', 'AUD', 'SGD', 'HKD']:
                    if curr in value_str:
                        return curr
            return 'USD'  # Default dollar is USD
        elif '€' in value_str or 'EUR' in value_str:
            return 'EUR'
        elif '£' in value_str or 'GBP' in value_str:
            return 'GBP'
        elif '¥' in value_str:
            if 'CNY' in value_str or 'YUAN' in value_str:
                return 'CNY'
            return 'JPY'  # Default yen is Japanese
        elif 'R' in value_str and any(word in value_str for word in ['RAND', 'ZAR']):
            return 'ZAR'
        
        # Default to USD if no currency detected
        return 'USD'
    
    def extract_numeric_value(self, value_str: str) -> float:
        """Enhanced numeric value extraction with better multiplier handling"""
        
        # Remove currency symbols and codes
        clean_str = re.sub(r'[€$£¥R]|USD|EUR|GBP|JPY|CAD|AUD|CHF|ZAR|KES|NGN|INR|SGD|HKD|CNY', '', value_str)
        clean_str = clean_str.strip()
        
        # Handle multipliers (case insensitive)
        multiplier = 1
        
        # Check for billion variants
        if re.search(r'\b(B|BN|BILLION|BILLIONS)\b', clean_str, re.IGNORECASE):
            multiplier = 1_000_000_000
            clean_str = re.sub(r'\b(B|BN|BILLION|BILLIONS)\b', '', clean_str, flags=re.IGNORECASE)
        # Check for million variants
        elif re.search(r'\b(M|MN|MILLION|MILLIONS|MIL)\b', clean_str, re.IGNORECASE):
            multiplier = 1_000_000
            clean_str = re.sub(r'\b(M|MN|MILLION|MILLIONS|MIL)\b', '', clean_str, flags=re.IGNORECASE)
        # Check for thousand variants
        elif re.search(r'\b(K|TH|THOUSAND|THOUSANDS)\b', clean_str, re.IGNORECASE):
            multiplier = 1_000
            clean_str = re.sub(r'\b(K|TH|THOUSAND|THOUSANDS)\b', '', clean_str, flags=re.IGNORECASE)
        
        # Extract the numeric part - handle decimals and commas
        numeric_match = re.search(r'[\d,]+\.?\d*', clean_str.replace(' ', ''))
        if numeric_match:
            number_str = numeric_match.group().replace(',', '')
            try:
                return float(number_str) * multiplier
            except ValueError:
                return 0.0
        
        return 0.0
    
    def normalize_geography(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced geography normalization with better international support"""
        geography_columns = ['Geography', 'State', 'Country', 'Location', 'Territory']
        
        for col in [c for c in geography_columns if c in df.columns]:
            if verbose:
                print(f"   🗺️  Normalizing {col}...")
            
            df[col] = df[col].apply(self.standardize_geography)
            
            if verbose:
                unique_count = df[col].nunique()
                top_locations = df[col].value_counts().head(5)
                print(f"   ✅ {col}: {unique_count} unique locations")
                print(f"      Top locations: {dict(top_locations)}")
        
        return df
    
    def standardize_geography(self, geo_str: str) -> str:
        """Enhanced geography standardization"""
        if pd.isna(geo_str) or str(geo_str).lower() in ['nan', 'none', '', 'not found']:
            return 'Unknown'
        
        geo_str = str(geo_str).strip()
        geo_lower = geo_str.lower()
        
        # Handle multi-part locations (e.g., "City, State, Country")
        parts = [part.strip() for part in geo_str.split(',')]
        
        if len(parts) > 1:
            # Process each part
            processed_parts = []
            for part in parts:
                part_lower = part.lower()
                # Check for mappings
                mapped = None
                for key, standard in self.geography_mappings.items():
                    if part_lower == key or key in part_lower:
                        mapped = standard
                        break
                processed_parts.append(mapped if mapped else part.title())
            return ', '.join(processed_parts)
        else:
            # Single location
            for key, standard in self.geography_mappings.items():
                if geo_lower == key or key in geo_lower:
                    return standard
            
            # Clean and return
            cleaned = re.sub(r'\s+', ' ', geo_str).title()
            return cleaned if cleaned else 'Unknown'
    
    def standardize_perils(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced peril standardization with multi-peril handling"""
        peril_columns = ['Peril', 'Perils', 'PerilsCovered', 'Coverage', 'Risk']
        
        for col in [c for c in peril_columns if c in df.columns]:
            if verbose:
                print(f"   ⚡ Standardizing {col}...")
            
            df[col] = df[col].apply(self.standardize_peril)
            
            if verbose:
                peril_counts = df[col].value_counts()
                print(f"   ✅ {col} distribution (top 10):")
                for peril, count in peril_counts.head(10).items():
                    print(f"      {peril}: {count}")
        
        return df
    
    def standardize_peril(self, peril_str: str) -> str:
        """Enhanced peril standardization with multi-peril support"""
        if pd.isna(peril_str) or str(peril_str).lower() in ['nan', 'none', '', 'not found']:
            return 'Unknown'
        
        peril_str = str(peril_str).strip()
        peril_lower = peril_str.lower()
        
        # Handle multiple perils separated by common delimiters
        delimiters = [';', '&', '+', 'and', ',', '|']
        multiple_perils = None
        
        for delimiter in delimiters:
            if delimiter in peril_lower:
                parts = peril_str.split(delimiter)
                if len(parts) > 1:
                    standardized_parts = []
                    for part in parts:
                        part = part.strip()
                        standardized = self._standardize_single_peril(part)
                        if standardized != 'Unknown':
                            standardized_parts.append(standardized)
                    
                    if standardized_parts:
                        return ' & '.join(standardized_parts)
                break
        
        # Single peril
        return self._standardize_single_peril(peril_str)
    
    def _standardize_single_peril(self, peril_str: str) -> str:
        """Standardize a single peril"""
        peril_lower = peril_str.lower().strip()
        
        # Direct mapping
        if peril_lower in self.peril_mappings:
            return self.peril_mappings[peril_lower]
        
        # Partial matching
        for key, standard in self.peril_mappings.items():
            if key in peril_lower:
                return standard
        
        # Clean and return if no match
        cleaned = re.sub(r'[^\w\s&/-]', '', peril_str)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip().title()
        
        return cleaned if cleaned else 'Unknown'
    
    def normalize_business_types(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced business type normalization"""
        business_columns = ['BusinessType', 'Occupation', 'Industry', 'Sector', 'Business']
        
        for col in [c for c in business_columns if c in df.columns]:
            if verbose:
                print(f"   🏢 Standardizing {col}...")
            
            df[col] = df[col].apply(self.standardize_business_type)
            
            if verbose:
                business_counts = df[col].value_counts()
                print(f"   ✅ {col} distribution (top 10):")
                for business, count in business_counts.head(10).items():
                    print(f"      {business}: {count}")
        
        return df
    
    def standardize_business_type(self, business_str: str) -> str:
        """Enhanced business type standardization"""
        if pd.isna(business_str) or str(business_str).lower() in ['nan', 'none', '', 'not found']:
            return 'Other'
        
        business_lower = str(business_str).lower().strip()
        
        # Direct mapping
        if business_lower in self.business_type_mappings:
            return self.business_type_mappings[business_lower]
        
        # Partial matching with scoring for best match
        best_match = None
        best_score = 0
        
        for key, standard in self.business_type_mappings.items():
            # Calculate match score based on word overlap
            key_words = set(key.split())
            business_words = set(business_lower.split())
            
            intersection = len(key_words.intersection(business_words))
            union = len(key_words.union(business_words))
            
            if union > 0:
                score = intersection / union
                if score > best_score and score > 0.3:  # Minimum similarity threshold
                    best_score = score
                    best_match = standard
        
        if best_match:
            return best_match
        
        # Clean and return if no match
        cleaned = re.sub(r'[^\w\s&/-]', '', business_str)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip().title()
        
        return cleaned if cleaned else 'Other'
    
    def handle_missing_values(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced missing value handling with intelligent imputation strategies"""
        
        # Define strategies for different types of columns
        missing_strategies = {
            # Text fields
            'Cedant': 'Unknown Cedant',
            'Insured': 'Unknown Insured', 
            'Broker': 'Unknown Broker',
            'Geography': 'Unknown Location',
            'State': 'Unknown',
            'Country': 'Unknown',
            'Location': 'Unknown',
            'Territory': 'Unknown',
            
            # Classification fields
            'Peril': 'Unknown',
            'BusinessType': 'Other',
            'Occupation': 'Other',
            'Industry': 'Other',
            'Sector': 'Other',
            
            # Financial fields
            'SumInsured': 0.0,
            'PastPremium': 0.0,
            'Retention': 0.0,
            'Deductible': 0.0,
            'Limit': 0.0,
            'Currency': 'USD',
            
            # Risk metrics
            'ClaimRatio': 0.0,
            'LossRatio': 0.0,
        }
        
        for col, fill_value in missing_strategies.items():
            if col in df.columns:
                missing_count = df[col].isna().sum()
                if missing_count > 0:
                    if verbose:
                        print(f"   🔧 Filling {missing_count} missing values in {col}")
                    df[col].fillna(fill_value, inplace=True)
        
        # Handle LossHistory (JSON field) specially
        if 'LossHistory' in df.columns:
            missing_loss = df['LossHistory'].isna().sum()
            if missing_loss > 0:
                if verbose:
                    print(f"   📊 Creating empty loss history for {missing_loss} records")
                df['LossHistory'].fillna('[]', inplace=True)
        
        # Advanced imputation for numeric columns based on business logic
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if df[col].isna().sum() > 0:
                # Use median imputation for most numeric fields
                median_val = df[col].median()
                if pd.notna(median_val):
                    df[col].fillna(median_val, inplace=True)
                    if verbose:
                        print(f"   📈 Imputed {col} with median value: {median_val:.2f}")
        
        return df
    
    def create_features(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced feature engineering with more sophisticated features"""
        
        if verbose:
            print("   🔬 Creating enhanced features...")
        
        # Feature 1: Premium Rate (Premium / Sum Insured)
        if 'PastPremium' in df.columns and 'SumInsured' in df.columns:
            df['PremiumRate'] = np.where(
                df['SumInsured'] > 0,
                df['PastPremium'] / df['SumInsured'],
                0
            )
            if verbose:
                print(f"   ✅ Created PremiumRate feature")
        
        # Feature 2: Loss Frequency
        if 'LossHistory' in df.columns:
            df['LossFrequency'] = df['LossHistory'].apply(self.calculate_loss_frequency)
            if verbose:
                print(f"   ✅ Created LossFrequency feature")
        
        # Feature 3: Average Annual Loss
        if 'LossHistory' in df.columns:
            df['AvgAnnualLoss'] = df['LossHistory'].apply(self.calculate_avg_annual_loss)
            if verbose:
                print(f"   ✅ Created AvgAnnualLoss feature")
        
        # Feature 4: Loss Severity (Avg Loss / Sum Insured)
        if 'AvgAnnualLoss' in df.columns and 'SumInsured' in df.columns:
            df['LossSeverity'] = np.where(
                df['SumInsured'] > 0,
                df['AvgAnnualLoss'] / df['SumInsured'],
                0
            )
            if verbose:
                print(f"   ✅ Created LossSeverity feature")
        
        # Feature 5: Risk Size Category with more granular buckets
        if 'SumInsured' in df.columns:
            df['RiskSizeCategory'] = pd.cut(
                df['SumInsured'],
                bins=[0, 1_000_000, 10_000_000, 50_000_000, 200_000_000, 1_000_000_000, float('inf')],
                labels=['Micro (<$1M)', 'Small ($1M-$10M)', 'Medium ($10M-$50M)', 
                       'Large ($50M-$200M)', 'Very Large ($200M-$1B)', 'Mega (>$1B)'],
                include_lowest=True
            )
            if verbose:
                print(f"   ✅ Created RiskSizeCategory feature")
        
        # Feature 6: Premium Adequacy Score
        if 'PremiumRate' in df.columns and 'ClaimRatio' in df.columns:
            df['PremiumAdequacy'] = np.where(
                df['ClaimRatio'] > 0,
                df['PremiumRate'] / df['ClaimRatio'],
                1.0
            )
            if verbose:
                print(f"   ✅ Created PremiumAdequacy feature")
        
        # Feature 7: Data Completeness Score
        df['DataCompletenessScore'] = df.apply(self.calculate_completeness_score, axis=1)
        if verbose:
            print(f"   ✅ Created DataCompletenessScore feature")
        
        # Feature 8: Retention Ratio (if retention data available)
        if 'Retention' in df.columns and 'SumInsured' in df.columns:
            df['RetentionRatio'] = np.where(
                df['SumInsured'] > 0,
                df['Retention'] / df['SumInsured'],
                0
            )
            if verbose:
                print(f"   ✅ Created RetentionRatio feature")
        
    
    # Normalize LossRatio (already a % in many datasets)
        if 'LossRatio' in df.columns:
            df['LossRatio'] = df['LossRatio'].clip(0, 1)   # ensure between 0–1
            if verbose: print("   ✅ Normalized LossRatio feature")

# Normalize ESG Score (0 = poor, 1 = good)
        if 'ESGScore' in df.columns:
            df['ESGScore'] = df['ESGScore'].clip(0, 1)
            if verbose: print("   ✅ Normalized ESGScore feature")

# Normalize Catastrophe Exposure (0–1 scale)
        if 'CatastropheExposure' in df.columns:
            df['CatastropheExposure'] = df['CatastropheExposure'].clip(0, 1)
            if verbose: print("   ✅ Normalized CatastropheExposure feature")
        return df

    
    def compute_risk_scores(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Compute advanced risk scores using the risk multipliers"""
        
        if verbose:
            print("   🎯 Computing risk scores...")
        
        # Geographic Risk Score
        df['GeographicRiskScore'] = df.get('State', 'Unknown').apply(self.calculate_geo_risk_score)
        
        # Business Type Risk Score
        df['BusinessTypeRiskScore'] = df.get('BusinessType', 'Other').apply(self.calculate_business_risk_score)
        
        # Peril Risk Score
        df['PerilRiskScore'] = df.get('Peril', 'Unknown').apply(self.calculate_peril_risk_score)
        
        # Combined Risk Score with enhanced weighting
        df['CombinedRiskScore'] = (
        df['GeographicRiskScore'] * 0.20 +          
        df['BusinessTypeRiskScore'] * 0.25 +        
        df['PerilRiskScore'] * 0.20 +               
        df.get('LossSeverity', 0) * 50 * 0.10 +     
        df.get('LossFrequency', 0) * 0.05 +
        df.get('LossRatio', 0) * 0.10 +             # NEW
        (1 - df.get('ESGScore', 0.5)) * 0.05 +      # penalize poor ESG
        df.get('CatastropheExposure', 0.5) * 0.05   # penalize catastrophe risk
        ).round(2)
 
        # Normalized Combined Risk Score (0-10 scale)
        if df['CombinedRiskScore'].max() > 0:
            df['NormalizedRiskScore'] = (
                (df['CombinedRiskScore'] - df['CombinedRiskScore'].min()) / 
                (df['CombinedRiskScore'].max() - df['CombinedRiskScore'].min()) * 10
            ).round(2)
        else:
            df['NormalizedRiskScore'] = 5.0
        
        # Risk Categories
        df['RiskCategory'] = pd.cut(
            df['NormalizedRiskScore'],
            bins=[0, 3, 6, 8, 10],
            labels=['Low Risk', 'Medium Risk', 'High Risk', 'Very High Risk'],
            include_lowest=True
        )
        
        if verbose:
            print(f"   ✅ Risk score distribution:")
            for category, count in df['RiskCategory'].value_counts().items():
                print(f"      {category}: {count}")
        
        return df
    
    def calculate_geo_risk_score(self, state: str) -> float:
        """Calculate geographic risk score using enhanced mapping"""
        state_str = str(state).upper().strip()
        return self.risk_multipliers['geography_risk'].get(state_str, 
                                                          self.risk_multipliers['geography_risk']['DEFAULT'])
    
    def calculate_business_risk_score(self, business_type: str) -> float:
        """Calculate business type risk score"""
        return self.risk_multipliers['business_risk'].get(str(business_type), 
                                                         self.risk_multipliers['business_risk']['DEFAULT'])
    
    def calculate_peril_risk_score(self, peril: str) -> float:
        """Calculate peril risk score with multi-peril handling"""
        peril_str = str(peril)
        
        # Handle multiple perils
        if '&' in peril_str:
            perils = [p.strip() for p in peril_str.split('&')]
            scores = [self.risk_multipliers['peril_risk'].get(p, 1.0) for p in perils]
            return max(scores)  # Take the highest risk peril
        
        return self.risk_multipliers['peril_risk'].get(peril_str, 
                                                      self.risk_multipliers['peril_risk']['DEFAULT'])
    
    def calculate_loss_frequency(self, loss_history_json: str) -> int:
        """Calculate number of loss events from loss history JSON"""
        try:
            if pd.isna(loss_history_json) or loss_history_json == '[]':
                return 0
            losses = json.loads(str(loss_history_json))
            return len(losses) if isinstance(losses, list) else 0
        except:
            return 0
    
    def calculate_avg_annual_loss(self, loss_history_json: str) -> float:
        """Calculate average annual loss from loss history JSON"""
        try:
            if pd.isna(loss_history_json) or loss_history_json == '[]':
                return 0.0
            losses = json.loads(str(loss_history_json))
            if not losses or not isinstance(losses, list):
                return 0.0
            
            total_loss = sum(loss.get('amount', 0) for loss in losses if isinstance(loss, dict))
            years = len(set(loss.get('year', 0) for loss in losses if isinstance(loss, dict)))
            
            return total_loss / max(years, 1)
        except:
            return 0.0
    
    def calculate_completeness_score(self, row: pd.Series) -> float:
        """Calculate enhanced data completeness score"""
        important_fields = [
            'Cedant', 'Insured', 'Geography', 'Peril', 'SumInsured',
            'BusinessType', 'PastPremium', 'ClaimRatio'
        ]
        
        filled_count = 0
        for field in important_fields:
            if field in row:
                value = str(row[field]).lower()
                if (pd.notna(row[field]) and 
                    value not in ['', '0', 'unknown', 'other', 'nan', 'not found', 'none']):
                    filled_count += 1
        
        return filled_count / len(important_fields)
    
    def validate_data(self, df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
        """Enhanced data validation with comprehensive quality checks"""
        
        if verbose:
            print("   ✅ Performing enhanced data validation...")
        
        validation_results = {
            'negative_values_fixed': 0,
            'extreme_ratios_flagged': 0,
            'duplicates_found': 0,
            'low_quality_records': 0,
            'data_anomalies': 0
        }
        
        # Check 1: Validate currency values are non-negative
        currency_cols = ['SumInsured', 'PastPremium', 'Retention', 'AvgAnnualLoss']
        for col in [c for c in currency_cols if c in df.columns]:
            negative_count = (df[col] < 0).sum()
            if negative_count > 0:
                if verbose:
                    print(f"   ⚠️  Fixed {negative_count} negative values in {col}")
                df.loc[df[col] < 0, col] = 0
                validation_results['negative_values_fixed'] += negative_count
        
        # Check 2: Flag extreme premium rates
        if 'PremiumRate' in df.columns:
            extreme_rates = ((df['PremiumRate'] > 0.5) | (df['PremiumRate'] < 0)).sum()
            if extreme_rates > 0:
                validation_results['extreme_ratios_flagged'] = extreme_rates
                if verbose:
                    print(f"   ⚠️  {extreme_rates} records with extreme premium rates")
        
        # Check 3: Check for potential duplicates
        duplicate_cols = ['Cedant', 'Insured', 'SumInsured', 'Peril']
        available_cols = [col for col in duplicate_cols if col in df.columns]
        if len(available_cols) >= 3:
            duplicates = df.duplicated(subset=available_cols, keep='first').sum()
            if duplicates > 0:
                validation_results['duplicates_found'] = duplicates
                if verbose:
                    print(f"   ⚠️  {duplicates} potential duplicate submissions")
                # Mark duplicates
                df['IsDuplicate'] = df.duplicated(subset=available_cols, keep='first')
        
        # Check 4: Data quality assessment
        if 'DataCompletenessScore' in df.columns:
            low_quality = (df['DataCompletenessScore'] < 0.5).sum()
            validation_results['low_quality_records'] = low_quality
            if low_quality > 0 and verbose:
                print(f"   ⚠️  {low_quality} records with low data completeness (<50%)")
        
        # Check 5: Detect data anomalies
        anomalies = 0
        
        # Anomaly: Very high sum insured with very low premium
        if 'SumInsured' in df.columns and 'PastPremium' in df.columns:
            high_si_low_prem = ((df['SumInsured'] > 100_000_000) & 
                               (df['PastPremium'] < 10_000)).sum()
            anomalies += high_si_low_prem
        
        # Anomaly: Zero sum insured but positive premium
        if 'SumInsured' in df.columns and 'PastPremium' in df.columns:
            zero_si_pos_prem = ((df['SumInsured'] == 0) & 
                               (df['PastPremium'] > 0)).sum()
            anomalies += zero_si_pos_prem
        
        validation_results['data_anomalies'] = anomalies
        
        # Create comprehensive quality flags
        df['QualityFlags'] = self.create_quality_flags(df)
        
        # Create validation summary
        df['ValidationSummary'] = df.apply(lambda row: self.create_validation_summary(row), axis=1)
        
        if verbose:
            print("   📊 Validation Summary:")
            print(f"      Total records processed: {len(df)}")
            print(f"      Records with issues fixed: {validation_results['negative_values_fixed']}")
            print(f"      High-quality records (>70% complete): {(df.get('DataCompletenessScore', 0) > 0.7).sum()}")
            print(f"      Clean records (no flags): {(df.get('QualityFlags', '') == 'CLEAN').sum()}")
        
        return df
    
    def create_quality_flags(self, df: pd.DataFrame) -> pd.Series:
        """Create enhanced quality flags for each record"""
        flags = []
        
        for _, row in df.iterrows():
            row_flags = []
            
            # Critical missing data
            if pd.isna(row.get('SumInsured')) or row.get('SumInsured', 0) == 0:
                row_flags.append('NO_SUM_INSURED')
            
            if str(row.get('Peril', '')).lower() in ['unknown', 'nan', '']:
                row_flags.append('NO_PERIL')
            
            if str(row.get('Geography', '')).lower() in ['unknown', 'unknown location', 'nan', '']:
                row_flags.append('NO_GEOGRAPHY')
            
            # Risk-related flags
            if row.get('NormalizedRiskScore', 0) > 8.0:
                row_flags.append('HIGH_RISK')
            
            if row.get('PremiumRate', 0) > 0.2:
                row_flags.append('HIGH_PREMIUM_RATE')
            
            if row.get('PremiumRate', 0) < 0.001 and row.get('SumInsured', 0) > 0:
                row_flags.append('LOW_PREMIUM_RATE')
            
            # Data quality flags
            if row.get('DataCompletenessScore', 0) < 0.5:
                row_flags.append('LOW_COMPLETENESS')
            
            if row.get('IsDuplicate', False):
                row_flags.append('DUPLICATE')
            
            # Business logic flags
            if (row.get('SumInsured', 0) > 500_000_000 and 
                row.get('BusinessType', '') not in ['Energy', 'Oil & Gas', 'Chemical']):
                row_flags.append('UNUSUAL_SIZE_FOR_BUSINESS')
            
            flags.append('|'.join(row_flags) if row_flags else 'CLEAN')
        
        return pd.Series(flags, index=df.index)
    
    def create_validation_summary(self, row: pd.Series) -> str:
        """Create a validation summary for each record"""
        summary_parts = []
        
        # Data completeness
        completeness = row.get('DataCompletenessScore', 0)
        if completeness >= 0.8:
            summary_parts.append("High Quality Data")
        elif completeness >= 0.5:
            summary_parts.append("Moderate Quality Data")
        else:
            summary_parts.append("Low Quality Data")
        
        # Risk assessment
        risk_score = row.get('NormalizedRiskScore', 5)
        if risk_score >= 8:
            summary_parts.append("Very High Risk")
        elif risk_score >= 6:
            summary_parts.append("High Risk")
        elif risk_score >= 4:
            summary_parts.append("Medium Risk")
        else:
            summary_parts.append("Low Risk")
        
        # Financial validation
        if row.get('SumInsured', 0) > 0 and row.get('PastPremium', 0) > 0:
            summary_parts.append("Financial Data Available")
        else:
            summary_parts.append("Limited Financial Data")
        
        return " | ".join(summary_parts)
    
    def generate_cleaning_report(self, original_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> Dict[str, Any]:
        """Generate comprehensive cleaning and analysis report"""
        
        report = {
            'processing_metadata': {
                'original_records': len(original_df),
                'cleaned_records': len(cleaned_df),
                'records_removed': len(original_df) - len(cleaned_df),
                'processing_timestamp': datetime.now().isoformat(),
                'pipeline_version': '2.0_enhanced'
            },
            'data_transformations': {
                'currency_conversions': {},
                'geography_standardization': {},
                'peril_standardization': {},
                'business_type_standardization': {}
            },
            'feature_engineering': {
                'new_features_created': 0,
                'risk_scores_computed': True,
                'advanced_features': []
            },
            'data_quality': {
                'overall_completeness': 0.0,
                'high_quality_records': 0,
                'records_with_issues': 0,
                'quality_distribution': {}
            },
            'risk_analysis': {
                'risk_distribution': {},
                'high_risk_records': 0,
                'average_risk_score': 0.0
            },
            'recommendations': [],
            'validation_results': {}
        }
        
        # Currency analysis
        currency_cols = ['SumInsured', 'PastPremium']
        for col in currency_cols:
            if col in cleaned_df.columns:
                report['data_transformations']['currency_conversions'][f'{col}_total_usd'] = float(cleaned_df[col].sum())
                report['data_transformations']['currency_conversions'][f'{col}_mean_usd'] = float(cleaned_df[col].mean())
        
        # Geography analysis
        if 'State' in cleaned_df.columns:
            geo_counts = cleaned_df['State'].value_counts()
            report['data_transformations']['geography_standardization'] = {
                'unique_locations': int(cleaned_df['State'].nunique()),
                'top_locations': dict(geo_counts.head(10).astype(int))
            }
        
        # Risk analysis
        if 'RiskCategory' in cleaned_df.columns:
            risk_dist = cleaned_df['RiskCategory'].value_counts()
            report['risk_analysis']['risk_distribution'] = dict(risk_dist.astype(int))
            report['risk_analysis']['high_risk_records'] = int((cleaned_df.get('NormalizedRiskScore', 0) >= 8).sum())
            report['risk_analysis']['average_risk_score'] = float(cleaned_df.get('NormalizedRiskScore', 0).mean())
        
        # Data quality analysis
        if 'DataCompletenessScore' in cleaned_df.columns:
            report['data_quality']['overall_completeness'] = float(cleaned_df['DataCompletenessScore'].mean())
            report['data_quality']['high_quality_records'] = int((cleaned_df['DataCompletenessScore'] > 0.7).sum())
        
        if 'QualityFlags' in cleaned_df.columns:
            clean_records = (cleaned_df['QualityFlags'] == 'CLEAN').sum()
            report['data_quality']['records_with_issues'] = int(len(cleaned_df) - clean_records)
        
        # Feature engineering summary
        new_features = [col for col in cleaned_df.columns if col not in original_df.columns]
        report['feature_engineering']['new_features_created'] = len(new_features)
        report['feature_engineering']['advanced_features'] = new_features
        
        # Generate recommendations
        self._generate_recommendations(report, cleaned_df)
        
        return report
    
    def _generate_recommendations(self, report: Dict, df: pd.DataFrame) -> None:
        """Generate actionable recommendations based on analysis"""
        recommendations = []
        
        # Data quality recommendations
        if report['data_quality']['overall_completeness'] < 0.6:
            recommendations.append("CRITICAL: Low data completeness. Consider requesting additional data fields from cedants.")
        
        high_risk_pct = report['risk_analysis']['high_risk_records'] / len(df)
        if high_risk_pct > 0.3:
            recommendations.append("WARNING: High proportion of high-risk submissions. Review underwriting criteria.")
        
        # Financial recommendations
        sum_insured_total = report['data_transformations']['currency_conversions'].get('SumInsured_total_usd', 0)
        if sum_insured_total == 0:
            recommendations.append("CRITICAL: No sum insured values available. Cannot perform proper risk assessment.")
        
        # Geographic concentration
        if 'geography_standardization' in report['data_transformations']:
            top_location_count = list(report['data_transformations']['geography_standardization']['top_locations'].values())[0]
            if top_location_count > len(df) * 0.5:
                recommendations.append("WARNING: High geographic concentration detected. Consider diversification.")
        
        # Premium adequacy
        if 'PremiumRate' in df.columns:
            low_premium_count = (df['PremiumRate'] < 0.001).sum()
            if low_premium_count > len(df) * 0.2:
                recommendations.append("WARNING: Many submissions with very low premium rates. Review pricing adequacy.")
        
        report['recommendations'] = recommendations


# Enhanced testing and demonstration
def test_enhanced_pipeline():
    """Test the enhanced pipeline with comprehensive sample data"""
    
    # Create more comprehensive test data
    test_data = {
        'Cedant': ['ABC Insurance Co', 'XYZ Reinsurance Ltd', 'Global Risk Partners', 'Premier Insurance'],
        'Insured': ['Tech Corp LLC', 'Chemical Manufacturing Inc', 'Energy Solutions Ltd', 'Retail Chain Corp'],
        'Geography': ['Los Angeles, California', 'Houston, Texas', 'London, UK', 'Mumbai, India'],
        'State': ['CA', 'TX', 'UK', 'IN'],
        'Peril': ['Fire & Explosion', 'Hurricane & Windstorm', 'All Risks', 'Earthquake'],
        'BusinessType': ['Technology', 'Chemical Manufacturing', 'Energy', 'Retail'],
        'SumInsured': ['$50M USD', '2.5B KES', '€100M', '₹500M INR'],
        'PastPremium': ['$2.5M', '125M KES', '€5M', '₹25M'],
        'ClaimRatio': [0.45, 0.65, 0.85, 0.32],
        'LossHistory': [
            '[{"year": 2022, "amount": 1000000}, {"year": 2023, "amount": 500000}]',
            '[{"year": 2021, "amount": 5000000}]',
            '[{"year": 2020, "amount": 8000000}, {"year": 2022, "amount": 3000000}]',
            '[]'
        ]
    }
    
    # Create DataFrame
    original_df = pd.DataFrame(test_data)
    print("📋 Original Data:")
    print(original_df.head())
    
    # Initialize enhanced pipeline
    pipeline = EnhancedDataCleaningPipeline()
    
    
    # Clean and transform data
    cleaned_df = pipeline.clean_and_transform_data(original_df, verbose=True)
    # Save as CSV
 
    # Generate comprehensive report
    report = pipeline.generate_cleaning_report(original_df, cleaned_df)
    
    print("\n📊 CLEANED DATA SAMPLE:")
    print("=" * 50)
    display_cols = ['Cedant', 'SumInsured', 'PremiumRate', 'RiskCategory', 'NormalizedRiskScore', 'QualityFlags']
    available_cols = [col for col in display_cols if col in cleaned_df.columns]
    print(cleaned_df[available_cols].head())
    
    print("\n📈 COMPREHENSIVE ANALYSIS REPORT:")
    print("=" * 50)
    print(json.dumps(report, indent=2, default=str))
    
    return cleaned_df, report


if __name__ == "__main__":
    # Run enhanced test
    cleaned_data, analysis_report = test_enhanced_pipeline()
    
    # Save cleaned data
    cleaned_data.to_csv("data/cleaned_submissions.csv", index=False)
    print("💾 Cleaned data saved to utils/structured/cleaned_submissions.csv")
    
    print("\n🎉 Enhanced pipeline testing completed successfully!")
