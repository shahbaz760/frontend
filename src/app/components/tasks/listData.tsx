import { projectColumnList } from "app/store/Projects";
import { AppDispatch } from "app/store/store";
import { useDispatch } from "react-redux";

export const useUpdateListData = async ({ task_start = 0, loader = true, drag = true, project_id, is_view = 0 }) => {
    const dispatch = useDispatch<AppDispatch>()
    const payload: any = {
        start: 0,
        limit: -1,
        search: "",
        project_id: project_id as string,
        task_start: task_start,
        task_limit: 20,
        project_column_id: 0,
        is_filter: 1,
        group: {
            key: null,
            order: 0,
        },
        sort: [],
        filter: [],
        is_view: is_view,
        is_filter_save: 0,
    };
    try {
        const res = await dispatch(projectColumnList({ payload, loader, drag }));
        const updatedList = res?.payload?.data?.data?.list;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};