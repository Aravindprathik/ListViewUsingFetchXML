import { useCollection } from "@cloudscape-design/collection-hooks";
import { Header } from "@cloudscape-design/components";
import Pagination from "@cloudscape-design/components/pagination";
import PropertyFilter, {
  PropertyFilterProps,
} from "@cloudscape-design/components/property-filter";
import Table, { TableProps } from "@cloudscape-design/components/table";
import * as React from "react";
import { SAMPLE_DATA } from "./CloudScapeRowData";
import {
  ANNOUNCEMENTS_DEFAULT_PREFERENCES,
  ANNOUNCEMENTS_FILTERING_PROPERTIES,
  ANNOUNCEMENT_COLUMN_DEFINITIONS,
  FetchXMLRowStructure,
  DEFAULT_ANNOUNCEMENT_VISIBLE_CONTENT_OPTIONS,
} from "./CloudScapeTableConfig";
import {
  BLANK_SEARCH_AND,
  Preferences,
  TableEmptyState,
  TableNoMatchState,
  getMatchesCountText,
  paginationAriaLabels,
  propertyFilterI18nStrings,
} from "./Utils";

export const CloudScapeTable: React.FC<any> = () => {
  const [announcementsTableEntity, setAnnouncementsTableEntity] =
    React.useState<FetchXMLRowStructure[]>(SAMPLE_DATA);
  const [selectedAnnouncements, setSelectedAnnouncements] = React.useState<
    FetchXMLRowStructure[]
  >([]);
  const [announcementsColumnDefinitions, setAnnouncementsColumnDefinitions] =
    React.useState(ANNOUNCEMENT_COLUMN_DEFINITIONS);

  const [filteringProperties, setFilteringProperties] = React.useState<
    PropertyFilterProps.FilteringProperty[]
  >(ANNOUNCEMENTS_FILTERING_PROPERTIES);
  const [preferences, setPreferences] = React.useState(
    ANNOUNCEMENTS_DEFAULT_PREFERENCES
  );
  const [query, setQuery] = React.useState(BLANK_SEARCH_AND);

  React.useEffect(() => {
    actions.setPropertyFiltering(query);
  }, [query]);

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
  } = useCollection(announcementsTableEntity, {
    propertyFiltering: {
      filteringProperties,
      empty: <TableEmptyState resourceName="KPI Results" />,
      noMatch: (
        <TableNoMatchState
          onClearFilter={() => {
            actions.setPropertyFiltering({ tokens: [], operation: "and" });
          }}
        />
      ),
    },
    pagination: {
      pageSize: preferences.pageSize,
    },
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: "fullname",
          // sortingComparator: (a: AnnouncementFlatTableEntity, b: AnnouncementFlatTableEntity) => {
          //   return dateTimeComparatorForTable(a.announcementDate, b.announcementDate);
          // },
        },
        isDescending: true,
      },
    },
  });

  return (
    <>
      <Table
        variant="embedded"
        stickyHeader={true}
        loading={false}
        loadingText={"Loading Results..."}
        items={items}
        selectionType={"single"}
        selectedItems={selectedAnnouncements}
        onSelectionChange={({ detail }) =>
          setSelectedAnnouncements(detail.selectedItems)
        }
        columnDefinitions={
          announcementsColumnDefinitions as TableProps.ColumnDefinition<FetchXMLRowStructure>[]
        }
        visibleColumns={preferences.visibleContent}
        resizableColumns={preferences.custom}
        wrapLines={preferences.wrapLines}
        stripedRows={preferences.stripedRows}
        contentDensity={preferences.contentDensity}
        header={
          <Header
            description={``}
          >
            {`Search`}
          </Header>
        }
        filter={
          <PropertyFilter
            i18nStrings={propertyFilterI18nStrings("Announcements")}
            countText={getMatchesCountText(filteredItemsCount!)}
            expandToViewport={true}
            {...propertyFilterProps}
            query={query}
            onChange={(event: any) => {
              setQuery(
                event.detail.tokens?.length === 0
                  ? BLANK_SEARCH_AND
                  : event.detail
              );
            }}
          />
        }
        {...collectionProps}
        pagination={
          <Pagination
            {...paginationProps}
            ariaLabels={paginationAriaLabels(paginationProps.pagesCount)}
          />
        }
        preferences={
          <Preferences
            preferences={preferences}
            setPreferences={setPreferences}
            visibleContentOptions={DEFAULT_ANNOUNCEMENT_VISIBLE_CONTENT_OPTIONS}
          />
        }
      />
    </>
  );
};
