import React from 'react'

//Import UI Components
import PetSearchResultCard from '../../components/Cards/SearchResultCard/PetSearchResultCard'
import PetOwnerSearchResultCard from '../../components/Cards/SearchResultCard/PetOwnerSearchResultCard'
import BusinessSearchResultCard from '../../components/Cards/SearchResultCard/BusinessSearchResultCard'
import ShelterSearchResultCard from '../../components/Cards/SearchResultCard/ShelterSearchResultCard'

//Import CSS
import styles from './SearchResults.module.css'

function SearchResults({searchResults, currentPage, searchCategory, displayFilterOverlay, panTo, maxResultsPages, previousPage, nextPage}) {
    return (
        <>
            <div className={styles['header-container']}>
                <span><span className={styles['header']}><h2>Results</h2></span><button className={styles['filter-button']} onClick={displayFilterOverlay}>Filter</button></span>
                {/* <div className={styles['sort-dropdown']}>
                    <span className={styles['sort-dropdown-label']}>Sort By:</span>
                    <select className={styles['sort-dropdown-select']}  name="search-category" id="search-category" onChange= {e => setResultsSortOption(e.target.value)}>
                        <option value="Account Age">Newly Added</option>
                        <option value="Distance">Distance</option>
                    </select>
                    <img src={DropdownIcon}/>
                </div>                 */}
            </div>
            <ul className={styles['search-results-list']}>
                {searchResults.length == 0 && <li className={styles['no-results']}>No {searchCategory} that Match your Search.</li>}
                {searchResults.length != 0 && searchCategory == 'Pets' && searchResults.map((searchResult,index) => (
                    <PetSearchResultCard key={searchResult.profile_id} searchResult={searchResult} index={index} panTo={panTo}/>
                ))}
                {searchResults.length != 0 && searchCategory == 'Businesses' && searchResults.map((searchResult, index) => (
                <BusinessSearchResultCard key={searchResult.profile_id} searchResult={searchResult} index={index} panTo={panTo}/>
                ))}
                {searchResults.length != 0 && searchCategory == 'Shelters' && searchResults.map((searchResult, index) => (
                    <ShelterSearchResultCard key={searchResult.profile_id} searchResult={searchResult} index={index} panTo={panTo}/>
                ))}
                {searchResults.length != 0 && searchCategory == 'Pet Owners' && searchResults.map((searchResult, index) => (
                    <PetOwnerSearchResultCard key={searchResult.profile_id} searchResult={searchResult} index={index}/>
                ))}
            </ul>
            <div className={styles['page-navigation-container']}>
                {currentPage != 1 && maxResultsPages != 1 && <button className={styles['back-button']} onClick={previousPage}>Prev Page</button>}
                {currentPage < maxResultsPages && <button className={styles['next-button']} onClick={nextPage}>Next Page</button>}
            </div>
       </>
    )
}

export default SearchResults
